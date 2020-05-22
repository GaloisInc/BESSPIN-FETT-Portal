import { Auth } from 'aws-amplify';

const BASE_API = process.env.REACT_APP_BASE_API_URI;

const makeHeaders = async () => {
  console.log('Stage: ', process.env.REACT_APP_STAGE);
  console.log('Process: ', process.env);

  const sesh = await Auth.currentSession();
  const idToken = sesh.getIdToken().getJwtToken();

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
      throw new Error(JSON.stringify(response));
    });
};
