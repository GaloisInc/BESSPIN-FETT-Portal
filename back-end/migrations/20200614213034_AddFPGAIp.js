exports.up = async function(knex, Promise) {
  await knex.schema.alterTable('Environment', table => {
    table.varchar('FPGAIp', 255);
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.alterTable('Environment', table => {
    table.dropColumn('FPGAIp');
  });
};
