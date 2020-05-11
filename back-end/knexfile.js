module.exports = {
  offline: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      user: 'fettportals',
      password: 'ive*got*money*balls',
      database: 'fettportal',
    },
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
    pool: { min: 2, max: 10 },
    useNullAsDefault: true,
  },
  dev: {
    client: 'mysql',
    connection: {
      host: 'DEV_HOST',
      user: 'DEV_USER',
      password: 'DEV_PASSWORD',
      database: 'fettportal_development',
    },
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
    pool: { min: 2, max: 10 },
    useNullAsDefault: true,
  },
  qa: {
    client: 'mysql',
    connection: {
      host: 'QA_HOST',
      user: 'QA_USER',
      password: 'QA_PASSWORD',
      database: 'fettportal_development',
      connectTimeout: 90000,
    },
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
    pool: { min: 2, max: 10 },
    useNullAsDefault: true,
  },
  preprod: {
    client: 'mysql',
    connection: {
      host: 'PREPROD_HOST',
      user: 'PREPROD_USER',
      password: 'PREPROD_PASSWORD',
      database: 'fettportal_development',
      connectTimeout: 90000,
    },
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
    pool: { min: 2, max: 10 },
    useNullAsDefault: true,
  },
};
