/* eslint-disable no-plusplus */
const aws = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const { Database, SsmHelper } = require('../../helpers');

const sqs = new aws.SQS();
const db = new Database();

const sendMessage = async message => {
  const params = {
    QueueUrl: process.env.RESEARCHER_INITIALIZATION_QUEUE_URL,
    MessageBody: JSON.stringify(message),
    MessageDeduplicationId: uuidv4(),
    MessageGroupId: String(message.Id),
  };
  console.log(params);
  return sqs.sendMessage(params).promise();
};

const initializeInstance = index =>
  new Promise(async (resolve, reject) => {
    try {
      const username = 'ftsresearcher';
      const password = await SsmHelper.getParameter(
        `/fettportal/credentials/${username}`
      );
      await db.makeConnection();
      const creator = await db.query(
        `SELECT Id, Region from User WHERE UserName = :UserName`,
        { UserName: 'ftsresearcher' }
      );

      const creatorId = creator[0].Id;
      const region = creator[0].Region;

      const configs = await db.query(
        `SELECT * FROM InstanceConfiguration WHERE IsActive = true`
      );

      console.log(configs);
      const totalConfigs = configs.length;
      const currentConfig = configs[index % totalConfigs];
      const { Type, OS, Id, Processor } = currentConfig;

      const data = await db.query(
        `INSERT INTO Environment (CreatedBy_FK, Configuration_FK, Region, Status) values (:CreatedBy, :Configuration, :Region, 'provisioning')`,
        {
          CreatedBy: creatorId,
          Configuration: Id,
          Region: region,
        }
      );
      const { insertId } = data;

      const params = {
        Id: insertId,
        Type,
        OS,
        Processor,
        Region: region,
        username,
        password,
        creatorId,
      };
      await sendMessage(params);
      console.log('provisioning', params);
      resolve('success');
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false; /* eslint no-param-reassign: 0 */
  const { spinupNumber } = event;
  console.log(spinupNumber);
  const initializerPromises = [];
  for (let i = 0; i < spinupNumber; i++) {
    const initializer = initializeInstance(i);
    initializerPromises.push(initializer);
  }
  await Promise.all(
    initializerPromises.map(prom => prom.catch(() => undefined))
  );
  // await Promise.all(initializerPromises).then(res => console.log(res));
};
