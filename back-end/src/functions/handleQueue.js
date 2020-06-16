const aws = require('aws-sdk');
const { Response, Database } = require('../helpers');

const cw = new aws.CloudWatch();

const createTemplate = f1 => ({
  start: '-PT6H',
  periodOverride: 'inherit',
  widgets: [
    {
      type: 'text',
      x: 0,
      y: 7,
      width: 3,
      height: 3,
      properties: {
        markdown: `Test Dash - for instance: ${f1}`,
      },
    },
  ],
});

const db = new Database();
exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false; /* eslint no-param-reassign: 0 */
  try {
    console.log(event);
    const record = event.Records[0];
    console.log(record);
    const { body } = record;
    console.log(body);
    const parsedBody = JSON.parse(body);
    console.log(parsedBody);

    if (parsedBody.Status === 'provisioned') {
      console.log('provisioned');
      console.log({
        FPGAIp: parsedBody.FPGAIp,
        F1Ip: parsedBody.F1Ip,
        InstanceId: parsedBody.InstanceId,
      });
      await db.makeConnection();

      const data = await db.query(
        `UPDATE Environment SET Status = "running", FPGAIp = :FPGAIp, IpAddress = :F1Ip WHERE F1EnvironmentId = :InstanceId`,
        {
          FPGAIp: parsedBody.FPGAIp,
          F1Ip: parsedBody.F1Ip,
          InstanceId: `${parsedBody.InstanceId}`,
        }
      );
      const params = {
        DashboardBody: JSON.stringify(createTemplate(parsedBody.InstanceId)),
        DashboardName: `FettPortal${parsedBody.InstanceId}`,
      };
      // cw.putDashboard(params, function(err, dash) {
      //   if (err) console.log(err, err.stack);
      //   // an error occurred
      //   else console.log(dash); // successful response
      // });
      const dash = await cw.putDashboard(params).promise();
      console.log(dash);
    } else if (parsedBody === 'terminated') {
      await db.makeConnection();
      const data = await db.query(
        `UPDATE Environment SET Status = "terminated" WHERE F1EnvironmentId = :InstanceId`,
        {
          InstanceId: `${parsedBody.InstanceId}`,
        }
      );
    } else {
      console.log('Error incorrect status in message');
    }
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};
