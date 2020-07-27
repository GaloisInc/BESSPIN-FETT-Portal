const aws = require('aws-sdk');
const { Response, Database } = require('../../helpers');

const db = new Database();
const sqs = new aws.SQS();

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

exports.handler = async event => {
  try {
    let body;
    if (event.body) {
      body = JSON.parse(event.body);
    } else {
      return new Response({ message: 'Invalid payload' }).success();
    }
    if (body.Status === 'provisioning') {
      await updateStatusToDB(body.Id);
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
      MessageDeduplicationId: String(body.F1EnvironmentId).replace('-', ''),
      MessageGroupId: String(Math.floor(Math.random(1) * 100)),
    };
    await sqs.sendMessage(params).promise();
    return new Response({ message: 'success' }).success();
  } catch (error) {
    console.log(error);
    return new Response({ message: error }).success();
  }
};
