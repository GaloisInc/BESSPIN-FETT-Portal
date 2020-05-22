const aws = require('aws-sdk');
const { Response, Database } = require('../helpers');

const db = new Database();
exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false; /* eslint no-param-reassign: 0 */
  try {
    await db.makeConnection();
    // const data = await db.query(`SELECT * FROM "InstanceConfiguration"`);
    const data = [
      {
        type: 'LMCO',
        processor: 'RV32',
        os: 'FreeRTOS',
      },
      {
        type: 'LMCO',
        processor: 'RV64',
        os: 'Linux',
      },
      {
        type: 'SRI Cambridge',
        processor: 'RV64',
        os: 'FreeBSD',
      },
      {
        type: 'UMich',
        processor: 'RV32',
        os: 'FreeRTOS',
      },
      {
        type: 'MIT',
        processor: 'RV64',
        os: 'Linux',
      },
      {
        type: 'Baseline',
        processor: 'RV32',
        os: 'FreeRTOS',
      },
      {
        type: 'Baseline',
        processor: 'RV64',
        os: 'Linux',
      },
      {
        type: 'Baseline',
        processor: 'RV64',
        os: 'FreeBSD',
      },
    ];
    return new Response({ items: data }).success();
  } catch (err) {
    console.log(err);
    return new Response({ error: 'Could not retreive data' }).fail();
  }
};
