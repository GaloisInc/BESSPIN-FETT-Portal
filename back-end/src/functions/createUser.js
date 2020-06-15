const aws = require('aws-sdk');
const jwt = require('jsonwebtoken');
const { Response, Database, SsmHelper } = require('../helpers');

const db = new Database();
exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false; /* eslint no-param-reassign: 0 */
  const decoded = jwt.decode(event.headers.Authorization);
  const username = decoded['cognito:username'];
  let body;
  if (event.body) {
    body = JSON.parse(event.body);
  }
  console.log(body);

  try {
    await db.makeConnection();
    if (body.role === 'researcher') {
      SsmHelper.putNewValue(
        `/fettportal/credentials/${body.username}`,
        body.password
      );
    }

    const creator = await db.query(
      `SELECT Id from User WHERE UserName = :UserName`,
      { UserName: username }
    );
    const creatorId = creator[0].Id;

    const data = await db.query(
      `INSERT INTO User (EmailAddress, Role, UserName, CreatedBy, Region) values (:EmailAddress, :Role, :UserName, :CreatedBy, :Region)`,
      {
        EmailAddress: body.emailAddress,
        Role: body.role,
        UserName: body.emailAddress,
        CreatedBy: creatorId,
        Region: body.region,
      }
    );
    return new Response({ items: data }).success();
  } catch (err) {
    console.log(err);
    return new Response({ error: 'Could not retreive data' }).fail();
  }
};
