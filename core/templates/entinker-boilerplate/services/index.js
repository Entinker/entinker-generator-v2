const knex = require('knex')
const config = require('../knexfile')
console.log(config[process.env.NODE_ENV])
const db = knex({
    ...config[process.env.NODE_ENV],
    debug: process.env.NODE_ENV === 'development'
})
const entinker = require('../entinker')

function init() {

    entinker.exposeGlobal('db', db)

}


module.exports = {
    init,
    db
}