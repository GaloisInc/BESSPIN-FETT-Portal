import { Auth, Hub } from 'aws-amplify';
import moment from 'moment/min/moment-with-locales';

const BASE_API = process.env.REACT_APP_BASE_API_URI;

const makeHeaders = async () => {
  const sesh = await Auth.currentSession();
  const idToken = sesh.getIdToken().getJwtToken();
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

export const getInstanceConfigurations = () =>
  new Promise(async (resolve, reject) => {
    fetch(`${BASE_API}/getInstanceConfigurations`, {
      headers: await makeHeaders(),
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
