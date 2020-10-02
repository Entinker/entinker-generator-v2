
exports.up = function(knex) {
  return knex.schema.createTable('user', table => {
      table.increments('user_id')
      table.string('display_name')
      table.string('phone').unique().notNullable()
      table.string('password',64)
      table.integer('user_type')
      table.boolean('is_active').defaultTo(1)
      table.timestamps()
  })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('user')
};
