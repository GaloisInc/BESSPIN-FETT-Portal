exports.up = async knex => {
  await knex.schema.alterTable('InstanceConfiguration', table => {
    table.renameColumn('AMIId_Eest', 'AMIId_East');
  });
};

exports.down = async knex => {
  await knex.schema.alterTable('InstanceConfiguration', table => {
    table.renameColumn('AMIId_East', 'AMIId_Eest');
  });
};
