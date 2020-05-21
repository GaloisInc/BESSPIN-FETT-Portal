const knex = require('knex');
const knexConfig = require('../../knexfile');

class Database {
  constructor() {
    this.pool = null;
    this.config = null;
  }

  async makeConnection() {
    return new Promise(async (resolve, reject) => {
      if (this.pool !== null) {
        return resolve();
      }
      this.connection = null;
      this.config = await knexConfig();
      this.pool = knex(this.config);
      return resolve();
    });
  }

  async query(query) {
    console.log('querying');
    return this.pool.raw(query).then(data => data[0]);
  }
}
module.exports = Database;
