const aws = require('aws-sdk');
const { sha512crypt } = require('sha512crypt-node');
const { Response, Database } = require('../../helpers');

const db = new Database();
const ec2 = new aws.EC2();
const ssm = new aws.SSM();

const writeInstanceInfoToDB = async (dbId, instanceId) => {
  await db.query(
    `UPDATE Environment set F1EnvironmentId = :instanceId WHERE id = :id`,
    { id: dbId, instanceId }
  );
};
const checkWestInstanceCount = async () => {
  const params = {
    Filters: [
      {
        Name: 'instance-type',
        Values: ['f1.2xlarge'],
      },
    ],
  };
  return ec2.describeInstances(params).promise();
};
const getParams = async name =>
  ssm
    .getParameter({
      Name: name,
      WithDecryption: true,
    })
    .promise()
    .then(data => data.Parameter.Value)
    .catch(err => {
      console.error(err);
    });

const getUserData = (f1Config, iName) => {
  const configOptions = [
    'username',
    'osImage',
    'binarySource',
    'rootUserAccess',
    'useCustomCredentials',
    'userPasswordHash',
    'processor',
  ];
  const subset = Object.keys(f1Config)
    .filter(key => configOptions.indexOf(key) >= 0)
    .reduce((obj2, key) => Object.assign(obj2, { [key]: f1Config[key] }), {});
  subset.awsJumpBoxIp = '172.31.30.56';
  // eslint-disable-next-line
  const userdata = `#cloud-boothook
#!/bin/bash
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1
echo \`date\`
sudo yum install -y jq git-lfs
echo \`date\`
sudo -i -u centos bash << EOF
cd /home/centos
source .bashrc
source .bash_profile
aws secretsmanager get-secret-value --secret-id githubAccess --region ${
    f1Config.region
  } | jq '.SecretString | fromjson' | jq '.gitHubSSHKey' -r | base64 -d > /home/centos/.ssh/id_rsa
chmod 400 /home/centos/.ssh/id_rsa
ssh-keyscan -H github.com >> ~/.ssh/known_hosts
echo \`date\`
git clone git@github.com:DARPA-SSITH-Demonstrators/SSITH-FETT-Target.git
echo \`date\`
pushd SSITH-FETT-Target/ 
git checkout develop
git submodule init
git submodule update --init --recursive
echo \`date\`
pushd SSITH-FETT-Binaries
echo \`date\`
git lfs pull
echo \`date\`
popd
nix-shell --command "python fett.py -ep awsProd -job ${iName} -cjson '${JSON.stringify(
    subset
  )
    .replace(/\//g, '\\/')
    .replace(/"/g, '\\"')}'"
echo \`date\`
EOF`;
  console.log(userdata);
  return Buffer.from(userdata).toString('base64');
};
const startInstance = async (f1Config, instanceName) => {
  console.log(f1Config);
  const iName = `${f1Config.processor}-${f1Config.osImage}-${
    f1Config.binarySource
  }-${instanceName}`;
  const params = {
    MaxCount: '1',
    MinCount: '1',
    NetworkInterfaces: [
      {
        AssociatePublicIpAddress: false,
        DeleteOnTermination: true,
        DeviceIndex: 0,
        Ipv6AddressCount: 0,
        SecondaryPrivateIpAddressCount: 1,
        SubnetId: f1Config.subnetIds[f1Config.subnetChoice],
      },
    ],
    BlockDeviceMappings: [
      {
        DeviceName: '/dev/sdm',
        Ebs: {
          DeleteOnTermination: true,
          Encrypted: false,
          Iops: 200,
          VolumeSize: 10,
          VolumeType: 'io1',
        },
      },
      /* more items */
    ],
    DisableApiTermination: false,
    DryRun: false, // change this back to false
    EbsOptimized: false,
    IamInstanceProfile: {
      Name: f1Config.instanceRoleName,
    },
    ImageId: f1Config.amiId,
    InstanceInitiatedShutdownBehavior: 'stop',
    InstanceType: 'f1.2xlarge',
    KeyName: f1Config.keyName,
    MetadataOptions: {
      HttpEndpoint: 'enabled',
      HttpTokens: 'optional',
    },
    Monitoring: {
      Enabled: true,
    },
    Placement: {
      Tenancy: 'dedicated',
    },
    TagSpecifications: [
      {
        ResourceType: 'instance',
        Tags: [
          {
            Key: 'Name',
            Value: iName,
          },
        ],
      },
    ],
    UserData: getUserData(f1Config, iName),
  };
  const ec2Data = await ec2.runInstances(params).promise();
  const sgParams = {
    InstanceId: ec2Data.Instances[0].InstanceId,
    Groups: [f1Config.securityGroupId],
  };
  await ec2.modifyInstanceAttribute(sgParams).promise();
  return new Promise((resolve, reject) => resolve(ec2Data));
};
const hashPassword = pw =>
  Buffer.from(sha512crypt(pw, 'xcnc07LxM26Xq')).toString('base64');
/**
 * Incoming payload
 * 
 * 
 * {
      Id: insertId,
      Type: body.Type,
      OS: body.OS,
      Processor: body.Processor,
      Region: region,
      username,
      password,
      creatorId,
    };
 */
exports.handler = async event => {
  await db.makeConnection();
  for (const msg of event.Records) {
    console.log(msg);
    const message = JSON.parse(msg.body);
    let f1Config = {
      region: message.Region,
      osImage: message.OS,
      processor: message.Processor,
      binarySource: message.Type,
      useCustomCredentials: 'yes',
      rootUserAccess: 'no',
      username: message.username,
      userPasswordHash: hashPassword(message.password),
      jobId: `${message.creatorId}-${message.insertId}`,
    };
    if (f1Config.region === 'us-west-2') {
      try {
        const res = await checkWestInstanceCount();
        const f1Count = res.Reservations && res.Reservations[0].Instances;
        if (f1Count.filter(ele => ele.State.Name === 'running') > 45) {
          // getting close to limit for region, manually switching to east
          // 45 leaves room for error and some randoms in the state of stopping, terminating, provisioning, etc...
          console.log('Changing region to us-east-1');
          f1Config.region = 'us-east-1';
        }
      } catch (e) {
        throw e;
      }
    }
    try {
      const config = await getParams(
        `/fetttarget/environment/config/${f1Config.region}`
      );
      f1Config = { ...f1Config, ...JSON.parse(config) };
      f1Config.subnetChoice = Math.round(Math.random(1)); // random 0 or 1
    } catch (e) {
      console.log(e);
      throw e;
    }
    let ec2Return = {};
    try {
      const instanceName = `${message.creatorId}-${message.Id}`;
      ec2Return = await startInstance(f1Config, instanceName);
      console.log('func return', ec2Return);
      if (
        Object.prototype.hasOwnProperty.call(ec2Return, 'errorType') &&
        ec2Return.errorType === 'InsufficientInstanceCapacity'
      ) {
        f1Config.subnetChoice = f1Config.subnetChoice === 1 ? 0 : 1;
        ec2Return = await startInstance(f1Config, instanceName);
      }
    } catch (e) {
      // handle retry? let lambda just auto-retry?
      throw e;
    }
    const instanceId = ec2Return.Instances[0].InstanceId;
    await writeInstanceInfoToDB(message.Id, instanceId);
  }
};
