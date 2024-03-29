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

export const getAnnouncements = () =>
  new Promise(async (resolve, reject) => {
    fetch(`${BASE_API}/getAnnouncements`, {
      headers: await makeHeaders(),
    })
      .then(handleErrors)
      .then(response => response.json())
      .then(body => resolve(body.items))
      .catch(response => {
        reject(response);
      });
  });

export const getAnnouncement = async announcementID =>
  new Promise(async (resolve, reject) => {
    const headers = await makeHeaders();
    fetch(`${BASE_API}/getAnnouncement`, {
      headers,
      method: 'POST',
      body: JSON.stringify({ id: `${announcementID}` }),
    })
      .then(handleErrors)
      .then(response => response.json())
      .then(body => resolve(body.items))
      .catch(response => {
        reject(response);
      });
  });

export const createAnnouncement = async announcement =>
  new Promise(async (resolve, reject) => {
    fetch(`${BASE_API}/createAnnouncement`, {
      headers: await makeHeaders(),
      body: JSON.stringify({
        ...announcement,
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

export const disableAnnouncement = Id =>
  new Promise(async (resolve, reject) => {
    fetch(`${BASE_API}/disableAnnouncement`, {
      headers: await makeHeaders(),
      method: 'PUT',
      body: JSON.stringify({ Id: `${Id}` }),
    })
      .then(handleErrors)
      .then(response => response.json())
      .then(body => resolve(body))
      .catch(response => {
        reject(response);
      });
  });

export const updateAnnouncement = announcement =>
  new Promise(async (resolve, reject) => {
    fetch(`${BASE_API}/updateAnnouncement`, {
      headers: await makeHeaders(),
      method: 'PUT',
      body: JSON.stringify({ ...announcement }),
    })
      .then(handleErrors)
      .then(response => response.json())
      .then(body => resolve(body))
      .catch(response => {
        reject(response);
      });
  });
