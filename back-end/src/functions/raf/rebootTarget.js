const aws = require('aws-sdk');
const util = require('util');
const { Response, Database } = require('../../helpers');

const db = new Database();
const s3 = new aws.S3();

const sendFile = async instanceId => {
  console.log(process.env.CURRENT_STAGE);
  const params = {
    Bucket: `${
      process.env.CURRENT_STAGE === 'develop' ? 'develop' : 'master'
    }-ssith-fett-target-researcher-artifacts`,
    Key: `fett-target/production/communication/rebooting/${instanceId}`,
    Body: 'Rebooted!',
  };
  console.log(params);
  return s3.putObject(params).promise();
};

const updateStatusToDB = async instanceId => {
  await db.makeConnection();
  const data = await db.query(
    `UPDATE Environment set Status = "rebooting" WHERE F1EnvironmentId = :instanceId`,
    { instanceId }
  );
  if (data.changedRows === 1) {
    const rowData = await db.query(
      `SELECT * FROM Environment WHERE F1EnvironmentId = :instanceId`,
      { instanceId }
    );
    return rowData;
  }
  throw new Error('Could not find supplied Instance ID in database');
};

const updateDBForError = async instanceId =>
  db.query(
    `UPDATE Environment set Status = "error" WHERE F1EnvironmentId = :instanceId`,
    { instanceId }
  );

const checkInstanceStatus = async (instanceId, region) => {
  // console.log('region', region);
  const ec2 = new aws.EC2({ region });
  return ec2
    .describeInstanceStatus({
      InstanceIds: [instanceId],
    })
    .promise();
};

const stopInstance = async (instanceId, region) => {
  const ec2 = new aws.EC2({ region });
  const params = {
    InstanceIds: [instanceId],
    DryRun: false,
    Force: false,
  };
  return ec2.stopInstances(params).promise();
};

exports.handler = async event => {
  if (!event.body) {
    return new Response({ Message: 'Invalid payload' }).fail();
  }
  try {
    const payload = JSON.parse(event.body);
    const dbData = await updateStatusToDB(payload.InstanceId);
    console.log(dbData);
    const region = dbData[0].Region;
    // first need to check region from Environment Table
    // instantiate aws.EC2 in the proper region
    // check if instanceID exists
    // if in state provisioning; stop instance and update DB
    // if not exists; update DB
    // else send termination message
    let instanceStatus;
    let running;
    try {
      instanceStatus = await checkInstanceStatus(payload.InstanceId, region);
      const status = instanceStatus.InstanceStatuses[0].InstanceState.Name;

      running = !!(status === 'running');
    } catch (e) {
      if (e.code === 'InvalidInstanceID.NotFound') {
        running = false;
      } else {
        throw e;
      }
    }
    if (running) {
      // send file to s3 to signal fett to reboot instance
      await sendFile(payload.InstanceId);
    } else {
      // just update the DB
      await updateDBForError(payload.InstanceId, region);
    }
    return new Response({ items: dbData }).success();
  } catch (e) {
    console.log(e);
    return new Response({ message: e }).success();
  }
};
