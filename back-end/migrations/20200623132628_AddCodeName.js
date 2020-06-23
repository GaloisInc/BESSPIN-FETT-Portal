exports.up = async function(knex, Promise) {
  await knex.schema.alterTable('InstanceConfiguration', table => {
    table.varchar('CodeName', 255);
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.alterTable('InstanceConfiguration', table => {
    table.dropColumn('CodeName');
  });
};
