exports.up = async function(knex, Promise) {
  await knex.schema.alterTable('InstanceConfiguration', table => {
    table.varchar('Variant', 255);
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.alterTable('InstanceConfiguration', table => {
    table.dropColumn('Variant');
  });
};
