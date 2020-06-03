const aws = require('aws-sdk');
const { Response, Database } = require('../helpers');

const db = new Database();
exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false; /* eslint no-param-reassign: 0 */
  try {
    await db.makeConnection();
    const data = await db.query(
      `SELECT e.*, c.*, u.UserName FROM Environment AS e JOIN InstanceConfiguration AS c ON e.Configuration_FK = c.Id JOIN User as u ON u.Id = e.CreatedBy_FK WHERE e.IsActive = TRUE;`
    );
    return new Response({ items: data }).success();
  } catch (err) {
    console.log(err);
    return new Response({ error: 'Could not retreive data' }).fail();
  }
};
