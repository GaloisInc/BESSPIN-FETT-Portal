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
    Key: `fett-target/production/communication/termination/${instanceId}`,
    Body: 'Terminated!',
  };
  console.log(params);
  return s3.putObject(params).promise();
};

const updateStatusToDB = async dbId => {
  await db.makeConnection();
  const data = await db.query(
    `UPDATE Environment set Status = "terminating" WHERE Id = :dbId`,
    { dbId }
  );
  if (data.changedRows === 1) {
    const rowData = await db.query(
      `SELECT * FROM Environment WHERE Id = :dbId`,
      { dbId }
    );
    return rowData;
  }
  throw new Error('Could not find supplied Instance ID in database');
};
const updateDBForTermined = async instanceId =>
  db.query(
    `UPDATE Environment set Status = "terminated" WHERE F1EnvironmentId = :instanceId`,
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
    const dbData = await updateStatusToDB(payload.Id);
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
      //   console.log(util.inspect(instanceStatus, { depth: null }));
      //   console.log(instanceStatus);
      //   console.log(instanceStatus.InstanceStatuses[0]);
      const status = instanceStatus.InstanceStatuses[0].InstanceState.Name;
      if (status === 'running') {
        running = 'running';
      } else if (status === 'pending') {
        running = 'pending';
      }
    } catch (e) {
      if (e.code === 'InvalidInstanceID.NotFound') {
        running = false;
      } else {
        throw e;
      }
    }
    if (running && running === 'running') {
      if (payload.Status === 'provisioning') {
        await stopInstance(payload.InstanceId);
        await updateDBForTermined(payload.InstanceId, region);
      } else {
        // send file to s3 to signal fett to stop instance
        await sendFile(payload.InstanceId);
      }
    } else if (running && running === 'pending') {
      // force an instance to stop with sdk
      await stopInstance(payload.InstanceId);
    } else {
      // just update the DB
      await updateDBForTermined(payload.InstanceId, region);
    }
    return new Response({ items: dbData }).success();
  } catch (e) {
    console.log(e);
    return new Response({ message: e }).success();
  }
};
