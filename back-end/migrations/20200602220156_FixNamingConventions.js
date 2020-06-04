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
    'ALTER TABLE `Environment` DROP FOREIGN KEY `environment_configuration_foreign`; ALTER TABLE `Environment` CHANGE COLUMN `CreatedBy` `CreatedBy_FK` INT(10) UNSIGNED NOT NULL , CHANGE COLUMN `Configuration` `Configuration_FK` INT(10) UNSIGNED NULL DEFAULT NULL ; ALTER TABLE `Environment` ADD CONSTRAINT `environment_configuration_foreign` FOREIGN KEY (`Configuration_FK`) REFERENCES `InstanceConfiguration` (`Id`);'
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

  await knex.schema.alterTable('Environment', table => {
    table.renameColumn('CreatedBy_FK', 'CreatedBy');

    table.renameColumn('Configuration_FK', 'Configuration');
  });

  await knex.schema.raw(
    'ALTER TABLE `Environment` CHANGE COLUMN `Created` `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP'
  );
  await knex.schema.raw(
    'ALTER TABLE `Environment` CHANGE COLUMN `Updated` `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP'
  );
};
