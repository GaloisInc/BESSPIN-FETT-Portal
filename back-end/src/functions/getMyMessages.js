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
  console.log(body);

  try {
    await db.makeConnection();

    const researcher = await db.query(
      `SELECT Id from User WHERE UserName = :UserName`,
      { UserName: username }
    );

    const researcherId = researcher[0].Id;

    const data = await db.query(
      `SELECT 
      m.*, r.UserName AS ResearcherName, s.UserName AS SpeakerName
  FROM
      Message AS m
          JOIN
      User AS r ON r.Id = m.ResearcherId_FK
          JOIN
      User AS s ON s.Id = m.SpeakerId_FK
  WHERE ResearcherId_FK = :ResearcherId
  ORDER BY Created ASC;`,
      { ResearcherId: researcherId }
    );
    return new Response({ items: data }).success();
  } catch (err) {
    console.log(err);
    return new Response({ error: 'Could not retreive data' }).fail();
  }
};
