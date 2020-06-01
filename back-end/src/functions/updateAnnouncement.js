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
      `UPDATE Announcement SET Team = :Team, Type = :Type, Payload = :Payload WHERE Id = :Id`,
      { Team: body.Team, Type: body.type, Payload: body.Payload, Id: body.Id }
    );
    return new Response({ items: data }).success();
  } catch (err) {
    console.log(err);
    return new Response({ error: 'Could not retreive data' }).fail();
  }
};
