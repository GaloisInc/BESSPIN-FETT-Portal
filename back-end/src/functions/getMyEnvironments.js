const aws = require('aws-sdk');
const jwt = require('jsonwebtoken');

const { Response, Database } = require('../helpers');

const db = new Database();

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false; /* eslint no-param-reassign: 0 */
  const decoded = jwt.decode(event.headers.Authorization);
  const username = decoded['cognito:username'];
  let body;
  if (event.body) {
    body = JSON.parse(event.body);
  }
  console.log(event);
  console.log(body);
  try {
    await db.makeConnection();

    const researcher = await db.query(
      `SELECT Id from User WHERE UserName = :UserName`,
      { UserName: username }
    );

    const researcherId = researcher[0].Id;

    const data = await db.query(
      `SELECT e.*, c.Type, c.OS, c.Processor, c.CodeName, c.Variant, u.UserName FROM Environment AS e JOIN InstanceConfiguration AS c ON e.Configuration_FK = c.Id JOIN User as u ON u.Id = e.CreatedBy_FK WHERE e.IsActive = TRUE AND u.ID = :Id ORDER BY Created DESC;`,
      { Id: researcherId }
    );
    return new Response({ items: data }).success();
  } catch (err) {
    console.log(err);
    return new Response({ error: 'Could not retreive data' }).fail();
  }
};
