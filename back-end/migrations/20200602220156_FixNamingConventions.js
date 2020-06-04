exports.up = async function(knex, Promise) {
  await knex.schema.alterTable('Announcement', table => {
    table.renameColumn('CreatedBy', 'CreatedBy_FK');
  });
  await knex.schema.raw(
    'ALTER TABLE `Announcement` CHANGE COLUMN `created_at` `Created` DATETIME DEFAULT CURRENT_TIMESTAMP'
  );
  await knex.schema.raw(
    'ALTER TABLE `Announcement` CHANGE COLUMN `updated_at` `Updated` DATETIME DEFAULT CURRENT_TIMESTAMP'
  );
  await knex.schema.alterTable('User', table => {
    table.renameColumn('CreatedBy', 'CreatedBy_FK');
  });
  await knex.schema.raw(
    'ALTER TABLE `User` CHANGE COLUMN `created_at` `Created` DATETIME DEFAULT CURRENT_TIMESTAMP'
  );
  await knex.schema.raw(
    'ALTER TABLE `User` CHANGE COLUMN `updated_at` `Updated` DATETIME DEFAULT CURRENT_TIMESTAMP'
  );

  await knex.schema.raw(
    'ALTER TABLE `Environment` CHANGE COLUMN `created_at` `Created` DATETIME DEFAULT CURRENT_TIMESTAMP'
  );
  await knex.schema.raw(
    'ALTER TABLE `Environment` CHANGE COLUMN `updated_at` `Updated` DATETIME DEFAULT CURRENT_TIMESTAMP'
  );
};

exports.down = async function(knex, Promise) {
  await knex.schema.alterTable('Announcement', table => {
    table.renameColumn('CreatedBy_FK', 'CreatedBy');
  });

  await knex.schema.raw(
    'ALTER TABLE `Announcement` CHANGE COLUMN `Created` `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP'
  );
  await knex.schema.raw(
    'ALTER TABLE `Announcement` CHANGE COLUMN `Updated` `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP'
  );

  await knex.schema.alterTable('User', table => {
    table.renameColumn('CreatedBy_FK', 'CreatedBy');
  });

  await knex.schema.raw(
    'ALTER TABLE `User` CHANGE COLUMN `Created` `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP'
  );
  await knex.schema.raw(
    'ALTER TABLE `User` CHANGE COLUMN `Updated` `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP'
  );

  await knex.schema.raw(
    'ALTER TABLE `Environment` CHANGE COLUMN `Created` `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP'
  );
  await knex.schema.raw(
    'ALTER TABLE `Environment` CHANGE COLUMN `Updated` `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP'
  );
};
