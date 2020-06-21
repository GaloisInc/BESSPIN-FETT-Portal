const aws = require('aws-sdk');
const { Response } = require('../../helpers');

const sqs = new aws.SQS();

exports.handler = async event => {
  let body;
  if (event.body) {
    body = JSON.parse(event.body);
  } else {
    return new Response({ message: 'Invalid payload' }).success();
  }
  const msg = {
    job: {
      id: 'something',
      status: 'success',
      reason: 'fett-target-production-termination',
    },
    instance: {
      id: body.F1EnvironmentId,
    },
  };
  const params = {
    QueueUrl: process.env.INSTANCE_STATUS_QUEUE_URL,
    MessageBody: JSON.stringify(msg),
    MessageDeduplicationId: String(body.F1EnvironmentId),
    MessageGroupId: String(Math.floor(Math.random(1) * 100)),
  };
  await sqs.sendMessage(params).promise();
  return new Response({ message: 'success' }).success();
};
