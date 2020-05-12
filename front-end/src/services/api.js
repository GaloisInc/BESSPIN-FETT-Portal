// import { CognitoAuth } from 'amazon-cognito-auth-js';
// import * as authConfig from '../.aws-config.js';

// const BASE_API = process.env.REACT_APP_BASE_API_URI;

// const makeHeaders = () => {
//   console.log('Stage: ', process.env.REACT_APP_STAGE);
//   console.log('Process: ', process.env);

//   const auth = new CognitoAuth(authConfig);
//   const sesh = auth.getCachedSession();
//   const idToken = sesh.idToken.jwtToken;

//   return {
//     Authorization: idToken,
//     'Content-Type': 'application/json',
//     //   'x-api-key': ###########,
//   };
// };
// function handleErrors(response) {
//   if (!response.ok) {
//     throw response;
//   }
//   return response;
// }
// export const GetFromDatabase = storeId =>
//   fetch(`${BASE_API}/getFromDatabase?storeId=${storeId}`, {
//     headers: makeHeaders(),
//   })
//     .then(handleErrors)
//     .then(response => response.json())
//     .then(body => body)
//     .catch(response => {
//       throw response.json();
//     });
