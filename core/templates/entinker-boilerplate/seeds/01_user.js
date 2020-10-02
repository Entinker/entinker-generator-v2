exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('user').del()
    .then(function () {
      // Inserts seed entries
      return knex('user').insert([{
        user_id: 1,
        display_name: 'Admin',
        phone: "0123456789",
        user_type: 1,
        is_active: 1,
        password: "$2a$10$06lyJQ6aUTESafvF3VmrFOdZNkGR44fzY7sGCAFxFL.4LY39t4HIi"
      }]);
    });
};