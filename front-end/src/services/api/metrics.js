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

export const getMetrics = () =>
  new Promise(async (resolve, reject) => {
    fetch(`${BASE_API}/reportOutMetrics`, {
      headers: await makeHeaders(),
    })
      .then(handleErrors)
      .then(response => response.json())
      .then(body => resolve(body))
      .catch(response => {
        reject(response.json());
      });
  });

export const getMetricsByType = configurationId =>
  new Promise(async (resolve, reject) => {
    fetch(`${BASE_API}/getMetricsByType`, {
      headers: await makeHeaders(),
      method: 'POST',
      body: JSON.stringify({ configurationId: `${configurationId}` }),
    })
      .then(handleErrors)
      .then(response => response.json())
      .then(body => resolve(body))
      .catch(response => {
        reject(response.json());
      });
  });
