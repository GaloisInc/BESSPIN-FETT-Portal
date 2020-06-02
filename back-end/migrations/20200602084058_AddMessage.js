exports.up = async function(knex, Promise) {
  await knex.schema.createTable('Message', table => {
    table.increments('Id').primary();
    table.foreign('ResearcherId').references('User.Id');
    table.varchar('Payload', 255).notNull();
    table
      .dateTime('Created')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    table
      .boolean('IsActive')
      .notNull()
      .defaultTo(true);
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  knex.schema.dropTable('Message');
};
