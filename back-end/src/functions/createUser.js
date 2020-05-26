const aws = require('aws-sdk');
const { Response, Database } = require('../helpers');

const db = new Database();
exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false; /* eslint no-param-reassign: 0 */
  try {
    const input = {
      Username: event.email,
      Role: event.role,
      CreatedBy: event.myUserName,
    };
    await db.makeConnection();
    const data = await db.query(`INSERT INTO User ?`, input);
    return new Response({ items: data }).success();
  } catch (err) {
    console.log(err);
    return new Response({ error: 'Could not retreive data' }).fail();
  }
};
