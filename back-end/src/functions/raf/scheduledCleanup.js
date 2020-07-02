const aws = require('aws-sdk');

const { Database } = require('../../helpers');

const db = new Database();

const sqs = new aws.SQS();

const terminateInstance = Id =>
  new Promise(async (resolve, reject) => {
    try {
      console.log(`terminating id: ${Id}`);
      const params = {
        QueueUrl: process.env.PORTAL_TO_INSTANCE_TERMINATION_QUEUE_URL,
        MessageBody: 'terminate',
        MessageAttributes: {
          instance_id: {
            DataType: 'String',
            StringValue: String(Id),
          },
        },
      };
      await sqs.sendMessage(params).promise();
      resolve(`success`);
    } catch (error) {
      console.log(error);
    }
  });

exports.handler = async (event, context) => {
  try {
    await db.makeConnection();

    const provisioningEnvironments = await db.query(
      `SELECT Id, Hour(TIMEDIFF( date(now()), date(Created))) as 'RunningTime' from Environment where Status = 'running'`
    );
    console.log(provisioningEnvironments);

    const longRunningInstances = provisioningEnvironments.filter(
      env => env.RunningTime >= 4
    );
    console.log(longRunningInstances);

    const terminationPromises = [];

    if (longRunningInstances.length > 0) {
      longRunningInstances.forEach(instance => {
        terminationPromises.push(terminateInstance(instance.Id));
      });

      Promise.all(
        terminationPromises.map(prom => prom.catch(e => console.log(e)))
      );
    } else {
      console.log('no long running instances');
    }
  } catch (err) {
    console.log(err);
  }
};
