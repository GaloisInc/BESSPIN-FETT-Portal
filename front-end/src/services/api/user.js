import { Auth } from 'aws-amplify';

const BASE_API = process.env.REACT_APP_BASE_API_URI;

const makeHeaders = async () => {
  console.log('Stage: ', process.env.REACT_APP_STAGE);
  console.log('Process: ', process.env);
  const sesh = await Auth.currentSession();
  const idToken = await sesh.getIdToken().getJwtToken();
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

export const createUser = async (email, role) =>
  new Promise(async (resolve, reject) => {
    const sesh = await Auth.currentSession();
    const myUsername = sesh.getAccessToken().payload.username;
    const headers = await makeHeaders();

    fetch(`${BASE_API}/createUser`, {
      headers,
      method: 'POST',
      body: JSON.stringify({ email: `${email}`, role: `${role}`, myUsername: `${myUsername}` }),
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
