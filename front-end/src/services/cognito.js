/* eslint-disable no-unused-vars */

import { Auth } from 'aws-amplify';

// import Generator from 'unique-names-generator';
import { createUser, updateDBUser, getTeams } from './api/user';

const generate = require('project-name-generator');

const AWS = require('aws-sdk');
const pwGenerator = require('generate-password');

const createAdmin = async (email, cognito) =>
  new Promise(async (resolve, reject) => {
    try {
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
    } catch (error) {
      reject(error);
    }
  });

const checkIsAdmin = async (email, cognito) =>
  new Promise(async (resolve, reject) => {
    try {
      const params = {
        Username: email,
        UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
      };
      cognito.adminGetUser(params, function(err, data) {
        if (err) {
          if (err.message === 'User does not exist.') resolve(false);
          else {
            reject(err);
          }
        } else {
          console.log(data);
          resolve(data);
        }
        // an error occurred // successful response
      });
    } catch (error) {
      reject(error);
    }
  });

const enableAdmin = async (email, cognito) =>
  new Promise(async (resolve, reject) => {
    const params = {
      Username: email,
      UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
    };

    cognito.adminEnableUser(params, async function(err, data) {
      if (err) {
        console.log(err, err.stack);
      } else {
        const isActive = true;
        const response = await updateDBUser(email, isActive);
        if (response) resolve('success');
      }
    });
    console.log(email);
    resolve(email);
  });

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

        const user = await checkIsAdmin(email, cognito);
        console.log(user);

        if (!user) {
          const admin = await createAdmin(email, cognito);
          resolve(admin);
        } else if (!user.Enabled) {
          const response = await enableAdmin(email, cognito);
          if (response) resolve('success');
        } else if (user.Enabled) {
          reject(new Error('User already exists'));
        }
      });
    } catch (error) {
      console.log(error);
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
      console.log(user);
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
            const isActive = false;
            const response = await updateDBUser(user.EmailAddress, isActive);
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
