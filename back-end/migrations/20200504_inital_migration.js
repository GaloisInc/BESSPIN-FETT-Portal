exports.up = async function(knex, Promise) {
  // example table
  await knex.schema.createTable('User', table => {
    table.increments('Id').primary();
    table.integer('CreatedBy');
    table.varchar('UserName', 255).notNull();
    table.varchar('EmailAddress', 255).notNull();
    table.varchar('Role', 255).notNull();
    table
      .boolean('IsActive')
      .notNull()
      .defaultTo(true);
    table.timestamps(true, true);
  });

  await knex.schema.createTable('Announcement', table => {
    table
      .integer('CreatedBy')
      .unsigned()
      .notNull();
    table.foreign('CreatedBy').references('User.Id');
    table.varchar('Team', 255).notNull();
    table.varchar('Type', 255).notNull();
    table.text('Payload');
    table
      .boolean('IsActive')
      .notNull()
      .defaultTo(true);
    table.timestamps(true, true);
  });
  await knex.schema.createTable('InstanceConfiguration', table => {
    table.increments('Id').primary();
    table.varchar('Type', 255).notNull();
    table.varchar('Processor', 255).notNull();
    table.varchar('OS', 255).notNull();
    table
      .boolean('IsActive')
      .notNull()
      .defaultTo(true);
  });
  await knex.schema.createTable('Environment', table => {
    table
      .integer('CreatedBy')
      .unsigned()
      .notNull();
    table.foreign('CreatedBy').references('User.Id');
    table.integer('Configuration').unsigned();
    table.foreign('Configuration').references('InstanceConfiguration.Id');
    table.varchar('Region', 255).notNull();
    table.varchar('Status', 255).notNull();
    table.varchar('F1EnvironmentId', 255).notNull();
    table.varchar('IpAddress', 255).notNull();
    table.integer('IdleSeconds');
    table.varchar('PrivateKeyStore', 255).notNull();
    table.varchar('LoggingLocation', 255).notNull();
    table
      .boolean('IsActive')
      .notNull()
      .defaultTo(true);
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('Environment'),
    knex.schema.dropTable('InstanceConfiguration'),
    knex.schema.dropTable('Announcement'),
    knex.schema.dropTable('User'),
  ]);
};
