/* eslint-disable no-unused-vars */

import { Auth } from 'aws-amplify';

// import Generator from 'unique-names-generator';
import { createUser, disableDBUser, getTeams } from './api/user';

const generate = require('project-name-generator');

const AWS = require('aws-sdk');
const pwGenerator = require('generate-password');

export const createAdminUser = async email =>
  new Promise(async (resolve, reject) => {
    try {
      Auth.currentCredentials().then(async res => {
        const auth = {
          apiVersion: '2016-04-18',
          region: 'us-west-2',
          credentials: res,
        };

        const cognito = new AWS.CognitoIdentityServiceProvider(auth);

        const password = pwGenerator.generate({
          strict: true,
          length: 10,
          numbers: true,
          symbols: true,
          uppercase: true,
          lowercase: true,
          exclude: `"',=`,
          excludeSimilarCharacters: true,
        });

        const params = {
          Username: email,
          TemporaryPassword: password,
          DesiredDeliveryMediums: ['EMAIL'],
          UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
          UserAttributes: [
            {
              Name: 'email',
              Value: email,
            },
          ],
        };

        cognito.adminCreateUser(params, function(err, data) {
          if (err) {
            reject(err);
          } else {
            const role = 'admin';
            const region = 'us-west-2';
            const response = createUser(email, role, region);
            resolve(response);
          }
          // an error occurred // successful response
        });
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateUser = async user =>
  new Promise(async (resolve, reject) => {
    try {
      Auth.currentCredentials().then(async res => {
        const auth = {
          apiVersion: '2016-04-18',
          region: 'us-west-2',
          credentials: res,
        };

        const cognito = new AWS.CognitoIdentityServiceProvider(auth);

        const params = {
          Username: 'mister.e@testing.fivetalent.com',
          UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
          UserAttributes: [
            {
              Name: 'email',
              Value: user.email,
            },
          ],
        };

        cognito.adminUpdateUserAttributes(params, function(err, data) {
          if (err) console.log(err, err.stack);
          // an error occurred
          else console.log(data); // successful response
        });
      });
    } catch (error) {
      reject(error);
    }
  });

export const disableUser = async user =>
  new Promise(async (resolve, reject) => {
    try {
      Auth.currentCredentials().then(async res => {
        const auth = {
          apiVersion: '2016-04-18',
          region: 'us-west-2',
          credentials: res,
        };

        const cognito = new AWS.CognitoIdentityServiceProvider(auth);

        const params = {
          Username: user.UserName,
          UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
        };

        cognito.adminDisableUser(params, async function(err, data) {
          if (err) {
            console.log(err, err.stack);
          } else {
            const response = await disableDBUser(user.Id);
            if (response) resolve('success');
          }
        });
      });
    } catch (error) {
      reject(error);
    }
  });

const createTeam = (username, password, region) =>
  new Promise(async (resolve, reject) => {
    try {
      Auth.currentCredentials().then(async res => {
        const auth = {
          apiVersion: '2016-04-18',
          region: 'us-west-2',
          credentials: res,
        };

        const cognito = new AWS.CognitoIdentityServiceProvider(auth);

        const params = {
          Username: username,
          TemporaryPassword: password,
          UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
        };

        cognito.adminCreateUser(params, async function(err, data) {
          if (err) {
            console.log(err, err.stack);
            resolve({ username: `${username} - ${err}`, password });
          } else {
            const role = 'researcher';
            const response = await createUser(username, role, region, username, password);
            if (response && response.Error) {
              resolve({ username: `${username} - ${response.Error.message}`, password });
            } else if (response) {
              resolve({ username, password });
            }
          }
          // an error occurred // successful response
        });
      });
    } catch (error) {
      reject(error);
    }
  });

export const createTeams = async teamNumber => {
  try {
    const currTeams = await getTeams();
    const teamCreation = [];
    for (let i = 0; i < teamNumber; i += 1) {
      // const team = createUser();
      const password = pwGenerator.generate({
        strict: true,
        length: 10,
        numbers: true,
        symbols: true,
        uppercase: true,
        lowercase: true,
        exclude: `"',=`,
        excludeSimilarCharacters: true,
      });
      const region = i % 2 === 0 ? 'us-west-2' : 'us-east-1';
      let username;
      const dups = team => team.UserName === username;
      while (!username || username.length > 14 || currTeams.some(dups)) {
        if (currTeams.some(dups)) {
          console.log(username);
        }
        const words = generate({ words: 2, alliterative: true }).raw;
        username = words.join('');
      }
      // console.log('newName', username);
      const teamPromise = createTeam(username, password, region);
      teamCreation.push(teamPromise);
    }
    const teams = await Promise.all(teamCreation).then(response => response);
    console.log(teamCreation.length);
    return teams;
  } catch (error) {
    throw new Error(error);
  }
};

export const resendInvite = email =>
  new Promise(async (resolve, reject) => {
    try {
      Auth.currentCredentials().then(async res => {
        const auth = {
          apiVersion: '2016-04-18',
          region: 'us-west-2',
          credentials: res,
        };

        const cognito = new AWS.CognitoIdentityServiceProvider(auth);

        const password = pwGenerator.generate({
          strict: true,
          length: 10,
          numbers: true,
          symbols: true,
          uppercase: true,
          lowercase: true,
          exclude: `"',=`,
          excludeSimilarCharacters: true,
        });

        const params = {
          Username: email,
          TemporaryPassword: password,
          MessageAction: 'RESEND',
          DesiredDeliveryMediums: ['EMAIL'],
          UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
          UserAttributes: [
            {
              Name: 'email',
              Value: email,
            },
          ],
        };

        const cognitoResponse = await cognito
          .adminSetUserPassword({
            UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
            Username: email,
            Password: password,
            Permanent: false,
          })
          .promise();
        if (cognitoResponse) {
          cognito.adminCreateUser(params, function(err, data) {
            if (err) console.log(err, err.stack);
            // an error occurred
            else resolve(data); // successful response
          });
        }
      });
    } catch (error) {
      reject(error);
    }
  });
