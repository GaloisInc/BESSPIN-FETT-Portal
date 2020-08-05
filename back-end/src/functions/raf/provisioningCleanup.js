const aws = require('aws-sdk');

const { Database } = require('../../helpers');

const db = new Database();

const cleanupInstance = (Id, F1Id, region) =>
  new Promise(async (resolve, reject) => {
    try {
      await db.makeConnection();
      const data = await db.query(
        `UPDATE Environment set Status = "error" WHERE Id = :Id`,
        { Id }
      );
      console.log(data);

      const ec2 = new aws.EC2({ region });
      const params = {
        InstanceIds: [F1Id],
        DryRun: false,
        Force: false,
      };
      return ec2
        .stopInstances(params)
        .promise()
        .then(res => {
          console.log(JSON.stringify(res));
          resolve(true);
        });
    } catch (error) {
      reject(error);
      console.log(error);
    }
  });

exports.handler = async (event, context) => {
  try {
    await db.makeConnection();

    const provisioningEnvironments = await db.query(
      `SELECT Id, F1EnvironmentId, Region 
       FROM Environment 
       WHERE Status = 'provisioning' 
              AND Created < NOW() - INTERVAL 45 MINUTE`
    );
    console.log(provisioningEnvironments);

    const cleanupPromises = [];

    if (provisioningEnvironments.length > 0) {
      provisioningEnvironments.forEach(instance => {
        cleanupPromises.push(
          cleanupInstance(
            instance.Id,
            instance.F1EnvironmentId,
            instance.Region
          )
        );
      });

      await Promise.all(cleanupPromises);
    } else {
      console.log('no long running instances');
    }
  } catch (err) {
    console.log(err);
  }
};
