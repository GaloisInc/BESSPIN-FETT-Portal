const aws = require('aws-sdk');
const { Response, Database } = require('../helpers');

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

    const creator = await db.query(
      `SELECT Id from User WHERE UserName = '${body.myUserName}'`
    );
    const creatorId = creator[0].Id;

    const data = await db.query(
      `INSERT INTO Environment (CreatedBy, Configuration, F1EnvironmentId, IpAddress, Region, Status) values (${creatorId}, ${
        body.Configuration
      }, '${body.F1EnvironmentId}', '${body.IpAddress}', '${body.Region}', '${
        body.Status
      }')`
    );
    return new Response({ items: data }).success();
  } catch (err) {
    console.log(err);
    return new Response({ error: 'Could not retreive data' }).fail();
  }
};
