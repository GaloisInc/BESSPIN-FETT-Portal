const aws = require('aws-sdk');
const { Response, Database } = require('../helpers');

const db = new Database();
exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false; /* eslint no-param-reassign: 0 */
  try {
    await db.makeConnection();
    const data = await db.query(
      `SELECT m.*, r.UserName as ResearcherName, s.UserName as SpeakerName FROM Message AS m JOIN User AS r ON r.Id = m.ResearcherId_FK JOIN User AS s ON s.Id = m.SpeakerId_FK WHERE m.IsActive = TRUE ORDER BY m.Created DESC;`
    );
    return new Response({ items: data }).success();
  } catch (err) {
    console.log(err);
    return new Response({ error: 'Could not retreive data' }).fail();
  }
};
