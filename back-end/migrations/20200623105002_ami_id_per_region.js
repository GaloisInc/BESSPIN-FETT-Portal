exports.up = async knex => {
  await knex.schema.alterTable('InstanceConfiguration', table => {
    table.renameColumn('AMIId', 'AMIId_West');
    table.varchar('AMIId_Eest', 255);
  });
};

exports.down = async knex => {
  await knex.schema.alterTable('InstanceConfiguration', table => {
    table.renameColumn('AMIId_West', 'AMIId');
    table.dropColumn('AMIId_Eest');
  });
};
