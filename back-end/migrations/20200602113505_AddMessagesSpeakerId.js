exports.up = async function(knex, Promise) {
  await knex.schema.table('Message', table => {
    table
      .integer('SpeakerId_FK')
      .references('Id')
      .inTable('User')
      .unsigned();
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.table('Message', table => {
    table.dropColumn('SpeakerId_FK');
  });
};
