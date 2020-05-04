const mysql = require('mysql');
const knexFile = require('../../knexfile');
const SsmHelper = require('./ssm');

class Database {
  constructor() {
    this.pool = null;
  }

  static connectionObject(connectionInfo) {
    return {
      host: connectionInfo.endpoint,
      user: connectionInfo.user,
      password: connectionInfo.password,
      database: connectionInfo.database,
      connectionLimit: 100,
    };
  }

  static async getConnection() {
    if (process.env.IS_OFFLINE === true) {
      return Database.connectionObject({
        ...knexFile.offline.connection,
        endpoint: knexFile.offline.connection.host,
      });
    }
    try {
      // eslint-disable-next-line
      const connectionInfo = await SsmHelper.getParametersByPath(`/fettportal/dev/db-aurora/`);
      return Database.connectionObject({
        ...connectionInfo,
        database: knexFile[process.env.stage].connection.database,
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async makeConnection() {
    return new Promise(async (resolve, reject) => {
      let pool;
      let conn;
      if (this.pool !== null) {
        return resolve(this.pool);
      }
      try {
        conn = await Database.getConnection();
      } catch (e) {
        console.log(e);
        throw e;
      }
      if (conn === undefined) {
        throw new Error('Connection Undefined');
      }
      try {
        pool = mysql.createPool(conn);
      } catch (e) {
        console.log('connection info', conn);
        return reject(new Error('Could not make pool connection'));
      }
      // Ping database to check for common exception errors.
      pool.getConnection((err, connection) => {
        if (err) {
          console.log(connection);
          if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.');
          }
          if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.');
          }
          if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.');
          }
          return reject(err);
        }
        if (connection) {
          connection.release();
        }
        this.pool = connection;
        return resolve();
      });
    });
  }

  async query(query) {
    return new Promise((resolve, reject) => {
      this.pool.query(query, (err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
  }
}
module.exports = Database;
