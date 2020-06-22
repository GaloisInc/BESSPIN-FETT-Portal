exports.up = async function(knex, Promise) {
  await knex.schema.alterTable('InstanceConfiguration', table => {
    table.varchar('AMIId', 255);
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.alterTable('InstanceConfiguration', table => {
    table.dropColumn('AMIId');
  });
};
