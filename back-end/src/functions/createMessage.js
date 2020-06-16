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
    console.log(body);
    const creator = await db.query(
      `SELECT Id from User WHERE UserName = :UserName`,
      { UserName: username }
    );

    const creatorId = creator[0].Id;

    const data = await db.query(
      `INSERT INTO Message (ResearcherId_Fk, SpeakerId_FK, Payload) values (:ResearcherId_FK, :SpeakerId_FK, :Payload)`,
      {
        SpeakerId_FK: creatorId,
        ResearcherId_FK: body.ResearcherId || creatorId, // uses creatorId if initiated by the researcher
        Payload: body.Payload,
      }
    );
    return new Response({ items: data }).success();
  } catch (err) {
    console.log(err);
    return new Response({ error: 'Could not retreive data' }).fail();
  }
};
