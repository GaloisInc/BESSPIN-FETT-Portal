exports.up = function(knex) {
  // example table
  return Promise.all([
    knex.schema.createTable('User', function(table) {
      table.increments('Id').primary();
      table.integer('CreatedBy').references('User.Id');
      table.varchar('UserName', 255).notNull();
      table.varchar('EmailAddress', 255).notNull();
      table.varchar('Role', 255).notNull();
      table
        .timestamp('Created')
        .notNull()
        .knex.fn.now();
      table
        .boolean('IsActive')
        .notNull()
        .defaultTo(true);
    }),
    knex.schema.createTable('Announcement', function(table) {
      table.increments('Id').primary();
      table.integer('CreatedBy').references('User.Id');
      table.varchar('Team', 255).notNull();
      table.varchar('Type', 255).notNull();
      table.text('Payload');
      table
        .timestamp('Created')
        .notNull()
        .knex.fn.now();
      table
        .boolean('IsActive')
        .notNull()
        .defaultTo(true);
    }),
    knex.schema.createTable('InstanceConfiguration', function(table) {
      table.increments('Id').primary();
      table.varchar('Type', 255).notNull();
      table.varchar('Processor', 255).notNull();
      table.varchar('OS', 255).notNull();
      table
        .boolean('IsActive')
        .notNull()
        .defaultTo(true);
    }),
    knex.schema.createTable('Environment', function(table) {
      table.increments('Id').primary();
      table.integer('CreatedBy').references('User.Id');
      table.integer('Configuration').references('InstanceConfiguration.Id');
      table.varchar('Region', 255).notNull();
      table
        .timestamp('Created')
        .notNull()
        .knex.fn.now();
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
    }),
  ]);
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('Environment'),
    knex.schema.dropTable('InstanceConfiguration'),
    knex.schema.dropTable('Announcement'),
    knex.schema.dropTable('User'),
  ]);
};
