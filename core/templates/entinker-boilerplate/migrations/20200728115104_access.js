
exports.up = function(knex) {
  
    return knex.schema.createTable('access', table => {
        table.increments('access_id')
        table.integer('restaurant_id')
        table.integer('user_id')
        table.json('privileges')
        table.timestamps()
    })

};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('access')  
};
