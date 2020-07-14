const aws = require('aws-sdk');

const { Database } = require('../../helpers');

const db = new Database();

const sqs = new aws.SQS();

const terminateInstance = Id =>
  new Promise(async (resolve, reject) => {
    try {
      console.log(`terminating id: ${Id}`);
      let messageAttrs = {
        REPLACE_ME: {
          DataType: 'String',
          StringValue: String(Id),
        },
      };

      let messageAttrsJson = JSON.stringify(messageAttrs);
      messageAttrsJson = messageAttrsJson.replace('REPLACE_ME', Id);
      messageAttrs = JSON.parse(messageAttrsJson);

      const params = {
        QueueUrl: process.env.PORTAL_TO_INSTANCE_TERMINATION_QUEUE_URL,
        MessageBody: 'terminate',
        MessageAttributes: messageAttrs,
      };
      sqs
        .sendMessage(params)
        .promise()
        .then(() => resolve(true));
    } catch (error) {
      reject(error);
      console.log(error);
    }
  });

exports.handler = async (event, context) => {
  try {
    await db.makeConnection();

    const provisioningEnvironments = await db.query(
      `SELECT Id, F1EnvironmentId 
       FROM Environment 
       WHERE Status = 'running' 
              AND Created < NOW() - INTERVAL 8 HOUR`
    );
    console.log(provisioningEnvironments);

    const terminationPromises = [];

    if (provisioningEnvironments.length > 0) {
      for (const instance of provisioningEnvironments) {
        const data = await db.query(
          `UPDATE Environment set Status = "terminating" WHERE Id = :dbId`,
          { dbId: instance.Id }
        );
        console.log('Data: ', data);
        if (data.changedRows === 1) {
          terminationPromises.push(terminateInstance(instance.F1EnvironmentId));
        }
      }

      await Promise.all(terminationPromises);
    } else {
      console.log('no long running instances');
    }
  } catch (err) {
    console.log(err);
  }
};
