const aws = require('aws-sdk');

const { Database } = require('../../helpers');

const db = new Database();
const s3 = new aws.S3();

const terminateInstance = Id =>
  new Promise(async (resolve, reject) => {
    try {
      console.log(`terminating id: ${Id}`);
      const params = {
        Bucket: `${
          process.env.CURRENT_STAGE === 'develop' ? 'develop' : 'master'
        }-ssith-fett-target-researcher-artifacts`,
        Key: `fett-target/production/communication/termination/${Id}`,
        Body: 'Terminated!',
      };
      console.log(params);
      return s3
        .putObject(params)
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
