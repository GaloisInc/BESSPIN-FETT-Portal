const aws = require('aws-sdk');
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
  return data;
};

exports.handler = async event => {
  if (!event.body) {
    return new Response({ Message: 'Invalid payload' }).fail();
  }
  try {
    const payload = JSON.parse(event.body);
    const dbData = await updateStatusToDB(payload.Id);
    if (dbData.changedRows === 1) {
      await sendMessage(payload.InstanceId);
      return new Response({ items: dbData }).success();
    }
    throw new Error('error updating db');
  } catch (e) {
    console.log(e);
    return new Response({ message: e }).success();
  }
};
