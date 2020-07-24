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

export const getUsers = () =>
  new Promise(async (resolve, reject) => {
    const headers = await makeHeaders();
    fetch(`${BASE_API}/getUsers`, {
      headers,
    })
      .then(handleErrors)
      .then(response => response.json())
      .then(body => {
        resolve(body.items);
      })
      .catch(response => {
        reject(response.json());
      });
  });

export const getTeams = () =>
  new Promise(async (resolve, reject) => {
    const headers = await makeHeaders();
    fetch(`${BASE_API}/getTeams`, {
      headers,
    })
      .then(handleErrors)
      .then(response => response.json())
      .then(body => {
        resolve(body.items);
      })
      .catch(response => {
        reject(response);
      });
  });

export const getMyUser = async username =>
  new Promise(async (resolve, reject) => {
    const headers = await makeHeaders();

    fetch(`${BASE_API}/getMyUser`, {
      headers,
      method: 'POST',
      body: JSON.stringify({ username: `${username}` }),
    })
      .then(handleErrors)
      .then(response => response.json())
      .then(body => resolve(body.items))
      .catch(response => {
        reject(response);
      });
  });

export const createUser = async (email, role, region, username, password) =>
  new Promise(async (resolve, reject) => {
    const headers = await makeHeaders();

    fetch(`${BASE_API}/createUser`, {
      headers,
      method: 'POST',
      body: JSON.stringify({
        emailAddress: `${email}`,
        role: `${role}`,
        region: `${region}`,
        username: `${username || ''}`,
        password: `${password || ''}`,
      }),
    })
      .then(handleErrors)
      .then(response => response.json())
      .then(body => resolve(body.items))
      .catch(response => {
        reject(response);
      });
  });

export const disableDBUser = Id =>
  new Promise(async (resolve, reject) => {
    fetch(`${BASE_API}/disableUser`, {
      headers: await makeHeaders(),
      method: 'PUT',
      body: JSON.stringify({ Id: `${Id}` }),
    })
      .then(handleErrors)
      .then(response => response.json())
      .then(body => resolve(body.items))
      .catch(response => {
        reject(response);
      });
  });
