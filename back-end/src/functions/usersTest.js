/* eslint-disable no-plusplus */
const aws = require('aws-sdk');
const { Database, SsmHelper } = require('../helpers');

const db = new Database();

const checkSSM = user =>
  new Promise(async (resolve, reject) => {
    try {
      const password = await SsmHelper.getParameter(
        `/fettportal/credentials/${user.UserName}`
      );
      console.log(`PASSWORD RETRIEVED fOR ${user.UserName}`);
      if (password) {
        resolve('success');
      }
    } catch (error) {
      resolve(`error getting password for ${user.UserName}`);
    }
  });

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false; /* eslint no-param-reassign: 0 */
  const userPromises = [];
  await db.makeConnection();
  const users = await db.query(
    `SELECT Id, UserName from User WHERE IsActive = true AND Role = 'researcher'`
  );
  users.forEach(user => {
    userPromises.push(checkSSM(user));
  });
  await Promise.all(userPromises).then(res => console.log(JSON.stringify(res)));
  console.log('TOTAL ACTIVE USERS', users.length);
  // await Promise.all(userPromises.map(prom => prom.catch(() => undefined)));
  // await Promise.all(initializerPromises).then(res => console.log(res));
};
