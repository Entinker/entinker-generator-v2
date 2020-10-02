exports.up = function(knex) { 
    return knex.schema.createTable('image', table => {
        table.increments('image_id').unique()
        table.string('image_name')
        table.string('group_id')
        table.timestamps()
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('image')
};
