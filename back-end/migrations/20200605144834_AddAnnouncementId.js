exports.up = async function(knex, Promise) {
  await knex.schema.alterTable('Announcement', table => {
    table.increments('Id').primary();
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.alterTable('Announcement', table => {
    table.increments('Id').primary();
  });
};
