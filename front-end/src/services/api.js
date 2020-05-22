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

export const GetFromDatabase = () => {
  console.log(BASE_API);
  const query = JSON.stringify({ query: `SELECT * FROM Users` });
  fetch(`${BASE_API}/getFromDatabase`, {
    headers: makeHeaders(),
    body: query,
  })
    .then(handleErrors)
    .then(response => response.json())
    .then(body => body)
    .catch(response => {
      throw new Error(response.json());
    });
};

export const createUser = async (email, role) => {
  const sesh = await Auth.currentSession();
  const myUserName = sesh.getAccessToken().payload.username;

  fetch(`${BASE_API}/createUser`, {
    headers: makeHeaders(),
    body: JSON.stringify({ email: `${email}`, role: `${role}`, myUserName: `${myUserName}` }),
  })
    .then(handleErrors)
    .then(response => response.json())
    .then(body => body)
    .catch(response => {
      throw new Error(response.json());
    });
};

export const disableUser = email => {
  fetch(`${BASE_API}/disableUser`, {
    headers: makeHeaders(),
    body: JSON.stringify({ email: `${email}` }),
  })
    .then(handleErrors)
    .then(response => response.json())
    .then(body => body)
    .catch(response => {
      throw new Error(response.json());
    });
};

export const getInstanceConfigurations = () => {
  fetch(`${BASE_API}/getInstanceConfigurations`, {
    headers: makeHeaders(),
  })
    .then(handleErrors)
    .then(response => response.json())
    .then(body => body)
    .catch(response => {
      throw new Error(response.json());
    });
};

export const getEnvironments = () => {
  fetch(`${BASE_API}/getEnvironments`, {
    headers: makeHeaders(),
  })
    .then(handleErrors)
    .then(response => response.json())
    .then(body => body)
    .catch(response => {
      throw new Error(response.json());
    });
};

export const createEnvironmentRecord = async configuration => {
  const sesh = await Auth.currentSession();
  const myUserName = sesh.getAccessToken().payload.username;

  fetch(`${BASE_API}/createEnvironment`, {
    headers: makeHeaders(),
    body: JSON.stringify({
      OS: `${configuration.OS}`,
      Processor: `${configuration.Processor}`,
      Type: `${configuration.Type}`,
      myUserName: `${myUserName}`,
    }),
  })
    .then(handleErrors)
    .then(response => response.json())
    .then(body => body)
    .catch(response => {
      throw new Error(response.json());
    });
};
