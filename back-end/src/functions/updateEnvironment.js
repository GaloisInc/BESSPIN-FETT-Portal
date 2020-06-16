const aws = require('aws-sdk');
const { Response, Database } = require('../helpers');

const sqs = new aws.SQS();

const addToterminationQueue = async terminationPayload => {
  const params = {
    MessageBody: JSON.stringify(terminationPayload),
    QueueUrl: process.env.RESEARCHER_TERMINATION_QUEUE_URL,
    MessageDeDuplicationId: terminationPayload.creatorId,
    MessageGroupId: terminationPayload.Id,
  };
  return sqs.sendMessage(params).promise();
};

const db = new Database();
exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false; /* eslint no-param-reassign: 0 */
  let body;
  if (event.body) {
    body = JSON.parse(event.body);
  }
  console.log(body);
  try {
    await db.makeConnection();
    const data = await db.query(
      `UPDATE Environment SET Status = :Status WHERE Id = :Id`,
      { Status: body.Status, Id: body.Id }
    );

    const params = {
      InstanceId: body.F1EnvironmentId,
    };

    const queueResponse = await addToterminationQueue(params);
    console.log(queueResponse);

    return new Response({ items: data }).success();
  } catch (err) {
    console.log(err);
    return new Response({ error: 'Could not retreive data' }).fail();
  }
};
