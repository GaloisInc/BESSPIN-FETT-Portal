const aws = require('aws-sdk');
const { Response } = require('../helpers');

const s3 = new aws.S3();

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false; /* eslint no-param-reassign: 0 */
  let body;
  if (event.body) {
    body = JSON.parse(event.body);
  }
  console.log(body.key);
  try {
    const params = {
      Bucket: `${process.env.CURRENT_STAGE}-ssith-fett-target-learn-docs`,
      Key: body.key,
    };
    const psUrl = s3.getSignedUrl('getObject', params);
    console.log('The URL is', psUrl);
    return new Response({ items: psUrl }).success();
  } catch (err) {
    console.log(err);
    return new Response({ error: 'Could not retreive data' }).fail();
  }
};
