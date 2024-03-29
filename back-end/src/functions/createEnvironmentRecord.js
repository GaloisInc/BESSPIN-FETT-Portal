const aws = require('aws-sdk');
const jwt = require('jsonwebtoken');
const { Response, Database, SsmHelper } = require('../helpers');

const sqs = new aws.SQS();
const db = new Database();

const sendMessage = async message => {
  console.log('sending message', message);
  const params = {
    QueueUrl: process.env.RESEARCHER_INITIALIZATION_QUEUE_URL,
    MessageBody: JSON.stringify(message),
    MessageDeduplicationId: `${message.creatorId}-${message.Id}`,
    MessageGroupId: String(message.Id),
  };
  return sqs.sendMessage(params).promise();
};

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false; /* eslint no-param-reassign: 0 */
  const decoded = jwt.decode(event.headers.Authorization);
  const username = decoded['cognito:username'];
  const password = await SsmHelper.getParameter(
    `/fettportal/credentials/${username}`
  );
  let body;
  if (event.body) {
    body = JSON.parse(event.body);
  }

  try {
    await db.makeConnection();
    const creator = await db.query(
      `SELECT Id, Region from User WHERE UserName = :UserName`,
      { UserName: username }
    );

    const creatorId = creator[0].Id;
    const region = creator[0].Region;

    const instanceCount = await db.query(
      `SELECT 
        COUNT(DISTINCT CASE
          WHEN
            CreatedBy_FK = :ResearcherId
          AND (Status = 'running' OR Status = 'provisioning' OR Status = 'queueing')
          THEN
            Id
          END) AS ActiveCount
      FROM Environment;`,
      { ResearcherId: creatorId }
    );

    const count = instanceCount[0].ActiveCount;
    if (username === 'ftsresearcher' || count < 2) {
      const data = await db.query(
        `INSERT INTO Environment (CreatedBy_FK, Configuration_FK, Region, Status) values (:CreatedBy, :Configuration, :Region, 'queueing')`,
        {
          CreatedBy: creatorId,
          Configuration: body.Configuration,
          Region: region,
          Status: body.Status,
        }
      );
      const { insertId } = data;

      const params = {
        Id: insertId,
        Type: body.Type,
        OS: body.OS,
        Processor: body.Processor,
        Variant: body.Variant,
        ConfigurationKey: body.Configuration,
        Region: region,
        username,
        password,
        creatorId,
      };
      await sendMessage(params);
      return new Response({ items: data }).success();
    }
    return new Response({
      message: 'Too many instances currently running',
    }).fail();
  } catch (err) {
    console.log(err);
    return new Response({ error: 'Could not retreive data' }).fail();
  }
};
