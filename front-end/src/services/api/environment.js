import { Auth } from 'aws-amplify';

const BASE_API = process.env.REACT_APP_BASE_API_URI;

const makeHeaders = async () => {
  const sesh = await Auth.currentSession();
  const idToken = await sesh.getIdToken().getJwtToken();
  return {
    Authorization: idToken,
    'Content-Type': 'application/json',
  };
};

function handleErrors(response) {
  console.log(response);
  if (!response.ok) {
    throw response;
  }
  return response;
}

export const getEnvironments = () =>
  new Promise(async (resolve, reject) => {
    fetch(`${BASE_API}/getEnvironments`, {
      headers: await makeHeaders(),
    })
      .then(handleErrors)
      .then(response => response.json())
      .then(body => resolve(body.items))
      .catch(response => {
        reject(response.json());
      });
  });

export const getMyEnvironments = async () =>
  new Promise(async (resolve, reject) => {
    const sesh = await Auth.currentSession();
    const myUserName = sesh.getAccessToken().payload.username;

    fetch(`${BASE_API}/getMyEnvironments`, {
      headers: await makeHeaders(),
      body: JSON.stringify({
        myUserName: `${myUserName}`,
      }),
      method: 'POST',
    })
      .then(handleErrors)
      .then(response => response.json())
      .then(body => resolve(body.items))
      .catch(response => {
        reject(response);
      });
  });

export const getRunningInstanceCount = async () =>
  new Promise(async (resolve, reject) => {
    const sesh = await Auth.currentSession();
    const myUserName = sesh.getAccessToken().payload.username;

    fetch(`${BASE_API}/getRunningInstanceCount`, {
      headers: await makeHeaders(),
      body: JSON.stringify({
        myUserName: `${myUserName}`,
      }),
      method: 'POST',
    })
      .then(handleErrors)
      .then(response => response.json())
      .then(body => resolve(body.items))
      .catch(response => {
        reject(response);
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
      .then(body => resolve(body.items))
      .catch(response => {
        reject(response);
      });
  });

export const updateEnvironmentStatus = async record =>
  new Promise(async (resolve, reject) => {
    fetch(`${BASE_API}/updateEnvironment`, {
      headers: await makeHeaders(),
      body: JSON.stringify({ Id: record.Id, Status: record.Status }),
      method: 'PUT',
    })
      .then(handleErrors)
      .then(response => response.json())
      .then(body => resolve(body))
      .catch(response => {
        reject(response);
      });
  });
