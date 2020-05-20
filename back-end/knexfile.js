const aws = require('aws-sdk');

const ssm = new aws.SSM();
const secrets = new aws.SecretsManager();
const getSecrets = async stage =>
  secrets
    .getSecretValue({
      SecretId: `fettportal-${stage}-db-password`,
    })
    .promise()
    .then(response => {
      if (!response) {
        throw new Error('Could not get DB password');
      }
      return response.SecretString;
    })
    .catch(err => {
      throw err;
    });

const getParameters = async stage =>
  ssm
    .getParametersByPath({
      Path: `/fettportal/${stage}/db-aurora/`,
    })
    .promise()
    .then(response => {
      if (!response.Parameters || !response.Parameters.length) {
        throw new Error('Could not locate SSM Parameters');
      }
      const params = response.Parameters;
      const ssmValues = {};
      params.forEach(param => {
        ssmValues[param.Name.split('/').pop()] = param.Value;
      });
      ['endpoint', 'user', 'schema'].forEach(param => {
        if (
          !Object.prototype.hasOwnProperty.call(ssmValues, param) ||
          !ssmValues[param]
        ) {
          throw new Error(`Could not locate ${param}`);
        }
      });
      return ssmValues;
    })
    .catch(err => {
      throw err;
    });

const fetchConfiguration = async () =>
  new Promise(async (resolve, reject) => {
    const env = process.env.CURRENT_STAGE
      ? process.env.CURRENT_STAGE
      : process.env.NODE_ENV;
    if (!env) {
      throw new Error('CURRENT_STAGE or NODE_ENV must be set');
    }
    if (env === 'local') {
      return resolve({
        host: '127.0.0.1',
        user: 'LocalMaster',
        password: 'HA*S#NFAjsjs*',
        database: 'FettPortal',
        port: 3306,
      });
    }
    const config = await getParameters();
    const password = await getSecrets();
    return resolve({
      host: config.endpoint,
      user: config.user,
      password,
      database: config.schema,
    });
  });

module.exports = async () => {
  const configuration = await fetchConfiguration();
  return {
    client: 'mysql',
    connection: configuration,
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
    pool: { min: 2, max: 10 },
    useNullAsDefault: true,
  };
};
