/* eslint-disable no-unused-vars */

const aws = require('aws-sdk');
const { Database, CloudWatch } = require('../helpers');

const db = new Database();
exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false; /* eslint no-param-reassign: 0 */
  try {
    const record = event.Records[0];
    const { body } = record;
    const parsedBody = JSON.parse(body);

    if (parsedBody.Status === 'provisioned') {
      await db.makeConnection();

      const data = await db.query(
        `UPDATE Environment SET Status = "running", FPGAIp = :FPGAIp, IpAddress = :F1Ip WHERE F1EnvironmentId = :InstanceId`,
        {
          FPGAIp: parsedBody.FPGAIp,
          F1Ip: parsedBody.F1Ip,
          InstanceId: `${parsedBody.InstanceId}`,
        }
      );
      const dash = await CloudWatch.putDashboard(parsedBody.InstanceId);
      console.log(dash);
    } else if (parsedBody.Status === 'terminated') {
      await db.makeConnection();
      const data = await db.query(
        `UPDATE Environment SET Status = "terminated" WHERE F1EnvironmentId = :InstanceId`,
        {
          InstanceId: `${parsedBody.InstanceId}`,
        }
      );
      const dash = await CloudWatch.deleteDashboards(parsedBody.InstanceId);
      console.log(dash);
    } else {
      console.log('Error incorrect status in message');
    }
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};
