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
    console.log(body);
    const creator = await db.query(
      `SELECT Id from User WHERE UserName = :UserName`,
      { UserName: body.myUserName }
    );

    const creatorId = creator[0].Id;

    const data = await db.query(
      `INSERT INTO Environment (CreatedBy_FK, Configuration_FK, F1EnvironmentId, IpAddress, Region, Status) values (:CreatedBy, :Configuration, :F1EnvironmentId, :IpAddress, :Region, :Status)`,
      {
        CreatedBy: creatorId,
        Configuration: body.Configuration,
        F1EnvironmentId: body.F1EnvironmentId,
        IpAddress: body.IpAddress,
        Region: body.Region,
        Status: body.Status,
      }
    );
    return new Response({ items: data }).success();
  } catch (err) {
    console.log(err);
    return new Response({ error: 'Could not retreive data' }).fail();
  }
};
