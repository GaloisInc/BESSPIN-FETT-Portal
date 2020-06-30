const aws = require('aws-sdk');
const util = require('util');
const { Response, Database } = require('../../helpers');

const sqs = new aws.SQS();
const db = new Database();

const sendMessage = async instanceId => {
  console.log(instanceId);
  const params = {
    QueueUrl: process.env.PORTAL_TO_INSTANCE_TERMINATION_QUEUE_URL,
    MessageBody: 'terminate',
    MessageAttributes: {
      instance_id: {
        DataType: 'String',
        StringValue: String(instanceId),
      },
    },
  };
  return sqs.sendMessage(params).promise();
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
  console.log('region', region);
  const ec2 = new aws.EC2({ region });
  return ec2
    .describeInstanceStatus({
      InstanceIds: [instanceId],
    })
    .promise();
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
      console.log(util.inspect(instanceStatus, { depth: null }));
      running =
        instanceStatus[0].InstanceState.Name === 'running' ||
        instanceStatus[0].instanceState.Name === 'pending';
    } catch (e) {
      if (e.code === 'InvalidInstanceID.NotFound') {
        running = false;
      } else {
        throw e;
      }
    }
    if (running) {
      // send message to stop instance
      await sendMessage(payload.InstanceId);
    } else {
      // just update the DB
      await updateDBForTermined(payload.InstanceId);
    }
    return new Response({ items: dbData }).success();
  } catch (e) {
    console.log(e);
    return new Response({ message: e }).success();
  }
};
