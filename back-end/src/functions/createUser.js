const aws = require('aws-sdk');
const { Response, Database } = require('../helpers');

const db = new Database();
exports.handler = async (event, context) => {
  console.log(event);
  context.callbackWaitsForEmptyEventLoop = false; /* eslint no-param-reassign: 0 */
  try {
    const input = [event.email, event.email, event.role];
    await db.makeConnection();
    const data = await db.query(
      `INSERT INTO User (EmailAddress, Role, UserName) values (?, ?, ?)`,
      input
    );
    return new Response({ items: data }).success();
  } catch (err) {
    console.log(err);
    return new Response({ error: 'Could not retreive data' }).fail();
  }
};
