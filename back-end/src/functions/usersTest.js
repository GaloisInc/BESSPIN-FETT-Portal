/* eslint-disable no-plusplus */
const aws = require('aws-sdk');
const { Database } = require('../helpers');

const db = new Database();
const cognito = new aws.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: 'us-west-2',
});

const deleteAccount = username =>
  new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const params = {
          UserPoolId:
            process.env.CURRENT_STAGE && process.env.CURRENT_STAGE === 'develop'
              ? process.env.COGNITO_USER_POOL_DEV
              : process.env.COGNITO_USER_POOL_MASTER,
          Username: username,
        };
        const cognitoResponse = await cognito.adminDeleteUser(params).promise();
        if (cognitoResponse) {
          await db.query(`DELETE FROM User WHERE UserName = :username`, {
            username,
          });
          resolve(`${username} deleted`);
        }
      } catch (error) {
        reject(error);
      }
    }, 200);
  });

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false; /* eslint no-param-reassign: 0 */
  const { activeAccounts } = event;
  await db.makeConnection();
  const inactiveAccounts = [];
  const accountsDeleted = [];

  const dbAccounts = await db.query(
    `SELECT Id, UserName from User WHERE IsActive = true AND Role = 'researcher'`
  );

  dbAccounts.forEach(account => {
    if (activeAccounts.every(user => user !== account.UserName)) {
      inactiveAccounts.push(account.UserName);
    }
  });

  console.log(inactiveAccounts);
  console.log('TOTAL INACTIVE ACCOUNTS - ', inactiveAccounts.length);
  console.log('TOTAL ACTIVE ACCOUNTS - ', activeAccounts.length);
  console.log('ACTIVE RESEARCHERS - ', dbAccounts.length);
  for (const account of inactiveAccounts) {
    try {
      const name = await deleteAccount(account);
      accountsDeleted.push(name);
    } catch (err) {
      console.log('error deleting', account, err);
    }
  }
  console.log(accountsDeleted);
};
