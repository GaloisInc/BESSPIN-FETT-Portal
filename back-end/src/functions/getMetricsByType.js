const aws = require('aws-sdk');
const { Response, Database } = require('../helpers');

const db = new Database();

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false; /* eslint no-param-reassign: 0 */
  try {
    await db.makeConnection();
    const results = {};
    let body;
    if (event.body) {
      body = JSON.parse(event.body);
    }
    console.log(body);

    const spinupsByUser = await db.query(
      `SELECT COUNT(u.UserName) as Count, u.UserName 
      FROM Environment as e 
        JOIN User as u
          ON u.ID = e.CreatedBy_FK
      WHERE e.Created > '2020-07-15 10:00am'
        AND u.IsRedTeam = true
        AND e.Configuration_FK = :ConfigurationId
      GROUP BY u.UserName
      ORDER BY Count DESC;`,
      { ConfigurationId: body.configurationId }
    );
    console.log(
      `Total number of instances by type and user spinning up since go-live: ${JSON.stringify(
        spinupsByUser
      )}`
    );
    results.spinupsTotalByUser = spinupsByUser;

    return new Response(results).success();
  } catch (err) {
    console.log(err);
    // return new Response({ error: 'Could not retreive data' }).fail();
  }
};
