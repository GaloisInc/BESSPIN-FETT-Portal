import { Auth } from 'aws-amplify';
import { createUser, disableDBUser } from './api/user';

const AWS = require('aws-sdk');
const generator = require('generate-password');

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

        const password = generator.generate({
          length: 10,
          numbers: true,
          symbols: true,
          uppercase: true,
          lowercase: true,
        });

        console.log('pass', password);

        const params = {
          Username: email,
          TemporaryPassword: `aB@4${password}`,
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
            console.log(err, err.stack);
          } else {
            const response = createUser(email, 'admin');
            return response;
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

        cognito.adminDisableUser(params, function(err, data) {
          if (err) {
            console.log(err, err.stack);
          } else {
            disableDBUser(user.Id);
            resolve('success');
          }
        });
      });
    } catch (error) {
      reject(error);
    }
  });

// Still waiting on how team creation will work
export const createTeams = async teamNumber => {
  console.log('IMPLEMENT CREATE TEAMS');
  // try {
  //   const teamCreation = [];
  //   for (let i = 0; i < teamNumber; i += 1) {
  //     const team = createUser();
  //     teamCreation.push(team);
  //   }
  //   const responses = await Promise.all(teamCreation);
  //   console.log(responses);
  // } catch (error) {
  //   throw new Error(error);
  // }
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

        const password = generator.generate({
          length: 10,
          numbers: true,
          symbols: true,
          uppercase: true,
          lowercase: true,
        });

        console.log('pass', password);

        const params = {
          Username: email,
          TemporaryPassword: `${password}1aA!`,
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

        cognito.adminCreateUser(params, function(err, data) {
          if (err) console.log(err, err.stack);
          // an error occurred
          else console.log(data); // successful response
        });
      });
    } catch (error) {
      reject(error);
    }
  });
