exports.up = async function(knex, Promise) {
  await knex.schema.alterTable('User', table => {
    table
      .varchar('Region', 255)
      .notNull()
      .defaultTo('us-west-2');
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.alterTable('User', table => {
    table.dropColumn('Region');
  });
};
