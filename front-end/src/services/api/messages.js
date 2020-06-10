import { Auth } from 'aws-amplify';

const BASE_API = process.env.REACT_APP_BASE_API_URI;

const makeHeaders = async () => {
  console.log('Stage: ', process.env.REACT_APP_STAGE);
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

export const getMessages = () =>
  new Promise(async (resolve, reject) => {
    fetch(`${BASE_API}/getMessages`, {
      headers: await makeHeaders(),
    })
      .then(handleErrors)
      .then(response => response.json())
      .then(body => resolve(body.items))
      .catch(response => {
        reject(response);
      });
  });

export const getConversations = () =>
  new Promise(async (resolve, reject) => {
    fetch(`${BASE_API}/getConversations`, {
      headers: await makeHeaders(),
    })
      .then(handleErrors)
      .then(response => response.json())
      .then(body => resolve(body.items))
      .catch(response => {
        reject(response);
      });
  });

export const getConversationById = id =>
  new Promise(async (resolve, reject) => {
    fetch(`${BASE_API}/getConversationById`, {
      headers: await makeHeaders(),
      body: JSON.stringify({
        ResearcherId_FK: `${id}`,
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

export const getMyMessages = () =>
  new Promise(async (resolve, reject) => {
    const sesh = await Auth.currentSession();
    const { username } = sesh.getAccessToken().payload;
    fetch(`${BASE_API}/getMyMessages`, {
      headers: await makeHeaders(),
      body: JSON.stringify({
        myUserName: `${username}`,
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

export const createMessage = async (message, researcherId) =>
  new Promise(async (resolve, reject) => {
    const sesh = await Auth.currentSession();
    const myUserName = sesh.getAccessToken().payload.username;

    fetch(`${BASE_API}/createMessage`, {
      headers: await makeHeaders(),
      body: JSON.stringify({
        myUserName: `${myUserName}`,
        ResearcherId: researcherId,
        Payload: message,
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
