const aws = require('aws-sdk');
const { Response, Database } = require('../helpers');

const db = new Database();
exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false; /* eslint no-param-reassign: 0 */
  try {
    const input = {
      EmailAddress: event.email,
      UserName: event.email,
      Role: event.role,
    };
    await db.makeConnection();
    const data = await db.query(`INSERT INTO User SET ?`, input);
    // 'INSERT INTO posts SET ?', {title: 'test'}
    return new Response({ items: data }).success();
  } catch (err) {
    console.log(err);
    return new Response({ error: 'Could not retreive data' }).fail();
  }
};
