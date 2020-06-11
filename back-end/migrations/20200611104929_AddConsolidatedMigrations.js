exports.up = async function(knex, Promise) {
  await knex.schema.createTable('User', table => {
    table.increments('Id').primary();
    table.integer('CreatedBy');
    table.varchar('UserName', 255).notNull();
    table.varchar('EmailAddress', 255).notNull();
    table.varchar('Role', 255).notNull();
    table
      .varchar('Region', 255)
      .notNull()
      .defaultTo('us-west-2');
    table
      .boolean('IsActive')
      .notNull()
      .defaultTo(true);
    table
      .dateTime('Created')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
  });

  await knex.schema.createTable('Announcement', table => {
    table.increments('Id').primary();
    table
      .integer('CreatedBy_FK')
      .references('Id')
      .inTable('User')
      .unsigned();
    table.varchar('Team', 255).notNull();
    table.varchar('Type', 255).notNull();
    table.text('Payload');
    table
      .boolean('IsActive')
      .notNull()
      .defaultTo(true);
    table
      .dateTime('Created')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
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
    table.increments('Id').primary();
    table
      .integer('CreatedBy_FK')
      .references('Id')
      .inTable('User')
      .unsigned();
    table
      .integer('Configuration_FK')
      .references('Id')
      .inTable('InstanceConfiguration')
      .unsigned();
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
    table
      .dateTime('Created')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
  });
  await knex.schema.createTable('Message', table => {
    table.increments('Id').primary();
    table
      .integer('ResearcherId_FK')
      .references('Id')
      .inTable('User')
      .unsigned();
    table.varchar('Payload', 255).notNull();
    table
      .dateTime('Created')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    table
      .boolean('IsActive')
      .notNull()
      .defaultTo(true);
    table
      .integer('SpeakerId_FK')
      .references('Id')
      .inTable('User')
      .unsigned();
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.dropTable('User');
  await knex.schema.dropTable('InstanceConfiguration');
  await knex.schema.dropTable('Environment');
  await knex.schema.dropTable('Announcement');
  await knex.schema.dropTable('Message');
};
