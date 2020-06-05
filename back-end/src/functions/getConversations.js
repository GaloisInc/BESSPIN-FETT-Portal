const aws = require('aws-sdk');
const { Response, Database } = require('../helpers');

const db = new Database();
exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false; /* eslint no-param-reassign: 0 */
  try {
    await db.makeConnection();
    const data = await db.query(
      `SELECT 
      m.*, r.UserName AS ResearcherName, s.UserName AS SpeakerName
  FROM
      Message AS m
          JOIN
      User AS r ON r.Id = m.ResearcherId_FK
          JOIN
      User AS s ON s.Id = m.SpeakerId_FK
  WHERE
      m.Id IN (SELECT 
              MAX(ID)
          FROM
              Message
          GROUP BY ResearcherId_FK);`
    );
    return new Response({ items: data }).success();
  } catch (err) {
    console.log(err);
    return new Response({ error: 'Could not retreive data' }).fail();
  }
};
