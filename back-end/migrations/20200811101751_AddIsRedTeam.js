exports.up = async function(knex, Promise) {
  await knex.schema.alterTable('User', table => {
    table
      .boolean('IsRedTeam')
      .notNull()
      .defaultTo(true);
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.alterTable('User', table => {
    table.dropColumn('IsRedTeam');
  });
};
