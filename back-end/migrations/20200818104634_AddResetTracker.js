exports.up = async function(knex, Promise) {
  await knex.schema.alterTable('Environment', table => {
    table.integer('ResetCount').defaultTo(0);
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.alterTable('Environment', table => {
    table.dropColumn('ResetCount');
  });
};
