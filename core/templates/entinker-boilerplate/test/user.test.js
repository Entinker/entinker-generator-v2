const request = require('supertest')
const knex = require('../services/index').db
const app = require('../app')

describe('User CRUD Test', () => {

    before(function (done) {

        console.log('before call back hooks')

        knex.migrate.down().then(() => {

            knex.migrate.latest().then(() => {
                return knex.seed.run();
            }).then(() => done());

        })

    });

    after(function (done) {
        // runs once after the last test in this block
        // knex.migrate.down().then(() => done());
      });


    it('Responds with 401 Error', (done) => {

        request(app)
            .post('/api/v1/user')
            .send({
                phone: "+919061037"
            })
            .expect(401, done)

    })

    it('Responds with 200 OK', (done) => {

        request(app)
            .post('/api/v1/user')
            .send({
                phone: "+919061037828",
                display_name: "John"
            })
            .expect(200, done)
    })
})