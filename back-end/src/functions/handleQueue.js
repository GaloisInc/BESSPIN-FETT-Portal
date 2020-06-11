const aws = require('aws-sdk');
// const { Response, Database } = require('../helpers');

// const db = new Database();
exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false; /* eslint no-param-reassign: 0 */
  try {
    console.log(event);
    event.Records.forEach(record => {
      const { body } = record;
      console.log(body);
    });
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};
