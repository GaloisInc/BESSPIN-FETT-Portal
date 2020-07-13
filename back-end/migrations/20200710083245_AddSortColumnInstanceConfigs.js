exports.up = async function(knex, Promise) {
  await knex.schema.alterTable('InstanceConfiguration', table => {
    table.integer('SortKey');
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.alterTable('InstanceConfiguration', table => {
    table.dropColumn('SortKey');
  });
};
