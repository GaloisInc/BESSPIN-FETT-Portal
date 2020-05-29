import { Auth } from 'aws-amplify';

const BASE_API = process.env.REACT_APP_BASE_API_URI;

const makeHeaders = async () => {
  console.log('Stage: ', process.env.REACT_APP_STAGE);
  console.log('Process: ', process.env);

  const sesh = await Auth.currentSession();
  const idToken = sesh.getIdToken().getJwtToken();
  console.log(sesh.getAccessToken().payload.username);

  return {
    Authorization: idToken,
    'Content-Type': 'application/json',
  };
};

function handleErrors(response) {
  if (!response.ok) {
    throw response;
  }
  return response;
}

export const getEnvironments = () =>
  new Promise(async (resolve, reject) => {
    fetch(`${BASE_API}/getEnvironments`, {
      headers: makeHeaders(),
    })
      .then(handleErrors)
      .then(response => response.json())
      .then(body => resolve(body))
      .catch(response => {
        reject(response.json());
      });
  });

export const createEnvironmentRecord = async configuration =>
  new Promise(async (resolve, reject) => {
    const sesh = await Auth.currentSession();
    const myUserName = sesh.getAccessToken().payload.username;

    fetch(`${BASE_API}/createEnvironmentRecord`, {
      headers: await makeHeaders(),
      body: JSON.stringify({
        myUserName: `${myUserName}`,
        ...configuration,
      }),
      method: 'POST',
    })
      .then(handleErrors)
      .then(response => response.json())
      .then(body => resolve(body))
      .catch(response => {
        reject(response);
      });
  });
