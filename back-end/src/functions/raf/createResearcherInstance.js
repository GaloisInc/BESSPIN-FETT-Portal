const aws = require('aws-sdk');
const { sha512crypt } = require('sha512crypt-node');
const util = require('util');
const { Response, Database } = require('../../helpers');

const db = new Database();
let ec2 = new aws.EC2({ region: 'us-west-2' });
const ssm = new aws.SSM();
const sqs = new aws.SQS();
const writeRegionAndInstanceIdToDB = async (dbId, instanceId, region) => {
  await db.query(
    `UPDATE Environment set F1EnvironmentId = :instanceId, Region = :region WHERE id = :id`,
    { id: dbId, instanceId, region }
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
  // eslint-disable-next-line
  const userdata = `#cloud-boothook
#!/bin/bash
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1
echo "Installing packages..."
sudo yum install -y jq git-lfs
echo "Setting up ssh files"
touch /home/centos/.ssh/config
touch /home/centos/.ssh/github
chown centos:centos /home/centos/.ssh/config
chown centos:centos /home/centos/.ssh/github
echo "running sub script as u centos..."
touch /home/centos/downloadAndStartFett.sh
chmod +x /home/centos/downloadAndStartFett.sh
chown centos:centos /home/centos/downloadAndStartFett.sh
JSON='${JSON.stringify(subset)}'
echo $JSON
IP=$(aws ec2 describe-instances --instance-ids \`curl -s http://169.254.169.254/latest/meta-data/instance-id\` --region ${
    f1Config.region
  } | jq -r '.Reservations[0].Instances[0].NetworkInterfaces[0].PrivateIpAddresses[] | select(.Primary == false).PrivateIpAddress')
echo $IP
OUT=$(jq -SRn $JSON | jq --arg ip "$IP" ' . + {"productionTargetIp": $ip}|tostring' | sed -e 's/^"//' -e 's/"$//' -e 's/"/\\"/' )
echo $OUT
tee /home/centos/downloadAndStartFett.sh << EOF
cd /home/centos
echo "Retrieving SSH key..."
aws secretsmanager get-secret-value --secret-id githubAccess --region us-west-2 | jq '.SecretString | fromjson' | jq '.gitHubSSHKey' -r | base64 -d > /home/centos/.ssh/github
echo "Setting up github ssh..."
ssh-keyscan -H github.com >> ~/.ssh/known_hosts
echo "Host github.com
HostName github.com
PreferredAuthentications publickey
IdentityFile /home/centos/.ssh/github
User git" > /home/centos/.ssh/config
chmod 400 /home/centos/.ssh/github
chmod 400 /home/centos/.ssh/config
echo "Cloning repo..."
git clone git@github.com:DARPA-SSITH-Demonstrators/SSITH-FETT-Target.git
pushd SSITH-FETT-Target/ 
echo "setting up git repo..."
git checkout master
git submodule init
git submodule update --init --recursive
pushd SSITH-FETT-Binaries
echo "Pulling binaries...."
git lfs pull
echo "Running fett command..."
popd
nix-shell --command "python fett.py -ep awsProd -job ${iName} -cjson '$OUT'"
EOF
/bin/su -c "/home/centos/downloadAndStartFett.sh" - centos /dev/null &/dev/null &
echo "Done with userdata script..."
`;

  console.log(userdata);
  return Buffer.from(userdata).toString('base64');
};
const callStartInstance = async (f1Config, instanceName) => {
  console.log(f1Config);

  if (f1Config.region === 'us-east-1') {
    ec2 = new aws.EC2({ region: 'us-east-1' });
  }
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

const mergeSSMparamsAndPortalParams = async f1Config => {
  const config = await getParams(
    `/fetttarget/environment/config/${f1Config.region}`
  );
  const amiColumn =
    f1Config.region === 'us-west-2' ? 'AMIId_West' : 'AMIId_East';
  const amiId = await db.query(
    `SELECT ${amiColumn} FROM InstanceConfiguration WHERE Id = :id`,
    { id: f1Config.ConfigurationKey }
  );
  console.log('Select AMI ID ', amiId);
  if (amiId[0][amiColumn] === null) {
    console.log(f1Config);
    throw new Error('Null AMI ID Specified');
  }
  return { ...f1Config, ...JSON.parse(config), amiId: amiId[0][amiColumn] };
};

const startInstance = async (f1Config, instanceName) => {
  if (f1Config.subnetIds.length < 1) {
    f1Config.region =
      f1Config.region === 'us-east-1' ? 'us-west-2' : 'us-east-1';
    console.log('Changing Region to: ', f1Config.region);
    // need to get other regions config values from SSM
    // eslint-disable-next-line no-param-reassign
    f1Config = await mergeSSMparamsAndPortalParams(f1Config);
  }
  f1Config.subnetChoice = Math.floor(Math.random() * f1Config.subnetIds.length);
  const ec2Return = await callStartInstance(f1Config, instanceName);
  console.log(util.inspect(ec2Return, { depth: null }));
  if (
    Object.prototype.hasOwnProperty.call(ec2Return, 'errorType') &&
    ec2Return.errorType === 'InsufficientInstanceCapacity'
  ) {
    f1Config.subnetIds.splice(f1Config.subnetChoice - 1, 1);
    await startInstance(f1Config, instanceName);
  }
  return ec2Return;
};

const deleteMessage = async msg => {
  sqs
    .deleteMessage({
      QueueUrl: process.env.RESEARCHER_INITIALIZATION_QUEUE_URL,
      ReceiptHandle: msg.receiptHandle,
    })
    .promise();
};
/**
 * Incoming portal payload
 *
 * {
      Id: insertId,
      Type: body.Type,
      OS: body.OS,
      Processor: body.Processor,
      ConfigurationKey: body.Configuration
      Region: region,
      username,
      password,
      creatorId,
    }
 *
 * SSM Payload example
 *
 * {
    "securityGroupId": "sg-04dd000b322bb16ef",
     "keyName": "researcher-uswest-f1key",
     "subnetIds": ["subnet-072693e099da6fa58", "subnet-0945a400dbc186b6d", "subnet-0ca9161c4572c767b" ],
     "instanceRoleName": "researcher-uswest-f1profile"
   }
 *
 *
*/
exports.handler = async event => {
  await db.makeConnection();
  for (const msg of event.Records) {
    console.log(msg);
    if (parseInt(msg.attributes.ApproximateReceiveCount) > 3) {
      // shoulld probably alert someone here too.
      await deleteMessage(msg);
      // eslint-disable-next-line no-continue
      continue;
    }
    const message = JSON.parse(msg.body);
    let f1Config = {
      region: message.Region,
      osImage: message.OS,
      processor: message.Processor,
      ConfigurationKey: message.ConfigurationKey,
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
        console.log('running instances', res);
        if (
          res.Reservations.length &&
          Object.prototype.hasOwnProperty.call(res.Reservations[0], 'Instances')
        ) {
          const f1Count = res.Reservations[0].Instances;
          const westCount = f1Count.filter(ele => ele.State.Name === 'running')
            .length;
          if (westCount > 45) {
            // getting close to limit for region, manually switching to east
            // 45 leaves room for error and some randoms in the state of stopping, terminating, provisioning, etc...
            console.log(
              `Changing region to us-east-1. ${westCount} instances running in us-west-2.`
            );
            f1Config.region = 'us-east-1';
          }
        }
      } catch (e) {
        throw e;
      }
    }
    try {
      f1Config = await mergeSSMparamsAndPortalParams(f1Config);
    } catch (e) {
      console.log('error merging params objects');
      throw e;
    }
    let instanceId = null;
    try {
      const instanceName = `${message.creatorId}-${message.Id}`;
      // recursively attempt to start instance in all available subnets for
      // specified region; once all subnets in region have been exhausted, repeat for other region
      const ec2Return = await startInstance(f1Config, instanceName);
      instanceId = ec2Return.Instances[0].InstanceId;
    } catch (e) {
      // handle retry? let lambda just auto-retry?
      // put message back in the queue for retrying

      console.log('Error Starting instance', e);
      console.log('handle', msg.receiptHandle);
      await sqs
        .changeMessageVisibility({
          QueueUrl: process.env.RESEARCHER_INITIALIZATION_QUEUE_URL,
          ReceiptHandle: msg.receiptHandle,
          VisibilityTimeout: 0,
        })
        .promise();
      throw e;
    }
    try {
      console.log(
        'RDS UPDATE PAYLOAD',
        message.Id,
        instanceId,
        f1Config.region
      );
      await writeRegionAndInstanceIdToDB(
        message.Id,
        instanceId,
        f1Config.region
      );
    } catch (e) {
      console.log('Error Writing instance information to DB');
      // If we have made it this far, the instance has been spun up but we had an error writing to the DB
      // that means that instance will be orphaned; lets terminate that instance so that doesn't happen
      await ec2.stopInstances({ InstanceIds: [instanceId] }).promise();
      // rethrow the error so this SQS message gets retried
      throw e;
    }
  }
};
