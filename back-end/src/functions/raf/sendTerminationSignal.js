const aws = require('aws-sdk');
const { Response, Database } = require('../../helpers');

const sqs = new aws.SQS();
const db = new Database();

const sendMessage = async instanceId => {
  const params = {
    QueueUrl: process.env.PORTAL_TO_INSTANCE_TERMINATION_QUEUE_URL,
    MessageBody: 'terminate',
    MessageAttributes: {
      DataType: 'String',
      StringValue: instanceId,
    },
  };
  return sqs.sendMessage(params).promise();
};
const updateStatusToDB = async dbId => {
  await db.query(
    `UPDATE Environment set status = "Stopping" WHERE id = :dbId`,
    { dbId }
  );
};

exports.handler = async event => {
  if (!event.body) {
    return new Response({ Message: 'Invalid payload' }).fail();
  }
  try {
    const payload = JSON.parse(event.body);

    const dbData = await updateStatusToDB(payload.Id);
    console.log(dbData);
    // await sendMessage(instanceId);
    new Response({ message: 'success' }).success();
  } catch (e) {
    new Response({ message: 'Invalid payload' }).success();
  }
};
