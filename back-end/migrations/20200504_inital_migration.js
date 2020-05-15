exports.up = function(knex) {
  // example table
  // return knex.schema.createTable('WorkOrders', function(table) {
  //   table.increments('id');
  //   table.varchar('orderId', 255).unique();
  //   table.varchar('siteNo', 255);
  //   table.varchar('orderStatusCd', 255);
  //   table.varchar('customerId', 255);
  //   table.varchar('consumerId', 255);
  //   table.varchar('licenseId', 255);
  //   table.varchar('licenseState', 255);
  //   table.varchar('vehicleMake', 255);
  //   table.varchar('vehicleModel', 255);
  //   table.varchar('vehicleYear', 255);
  //   table.datetime('woCreatedDate');
  //   table.datetime('timeExpected');
  //   table.bool('isVisible').defaultTo(true);
  // });
};

exports.down = function(knex) {
  // return knex.schema.dropTable('WorkOrders');
};
