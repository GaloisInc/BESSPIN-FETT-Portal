import { Auth, Hub } from 'aws-amplify';
import moment from 'moment';

const BASE_API = process.env.REACT_APP_BASE_API_URI;

const makeHeaders = async () => {
  const sesh = await Auth.currentSession();
  const idToken = await sesh.getIdToken().getJwtToken();
  const issueTime = moment.unix(sesh.getIdToken().payload.auth_time);
  const seshTime = moment().diff(issueTime, 'hours');
  if (seshTime >= 24) {
    alert('Your session has ended.  To continue using the FETT Bug Bounty Portal please login again');
    Hub.dispatch('auth', { event: 'logout', data: {}, message: 'logout' });
  }

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
    fetch(`${BASE_API}/createEnvironmentRecord`, {
      headers: await makeHeaders(),
      body: JSON.stringify({
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

export const terminateEnvironment = async record =>
  new Promise(async (resolve, reject) => {
    fetch(`${BASE_API}/updateEnvironment`, {
      headers: await makeHeaders(),
      body: JSON.stringify({ Id: record.Id, Status: record.Status, InstanceId: record.F1EnvironmentId }),
      method: 'PUT',
    })
      .then(handleErrors)
      .then(response => response.json())
      .then(body => resolve(body))
      .catch(response => {
        reject(response);
      });
  });

export const forceTerminateEnvironment = async record =>
  new Promise(async (resolve, reject) => {
    fetch(`${BASE_API}/forceTermination`, {
      headers: await makeHeaders(),
      body: JSON.stringify({ Id: record.Id, Status: record.Status, F1EnvironmentId: record.F1EnvironmentId }),
      method: 'POST',
    })
      .then(handleErrors)
      .then(response => response.json())
      .then(body => resolve(body))
      .catch(response => {
        reject(response);
      });
  });

export const rebootTarget = async record =>
  new Promise(async (resolve, reject) => {
    console.log('rebooting2', record);
    fetch(`${BASE_API}/rebootTarget`, {
      headers: await makeHeaders(),
      body: JSON.stringify({ Id: record.Id, Status: record.Status, InstanceId: record.F1EnvironmentId }),
      method: 'PUT',
    })
      .then(handleErrors)
      .then(response => response.json())
      .then(body => resolve(body))
      .catch(response => {
        reject(response);
      });
  });
