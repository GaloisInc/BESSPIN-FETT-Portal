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

    const data = await db.query(
      `SELECT * from User WHERE UserName = :UserName`,
      { UserName: body.username }
    );
    return new Response({ items: data }).success();
  } catch (err) {
    console.log(err);
    return new Response({ error: 'Could not retreive data' }).fail();
  }
};