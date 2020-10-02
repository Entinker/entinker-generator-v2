const request = require('supertest')
const app = require('../app')

describe('App Test', () => {

it('Responds with 200 OK', (done) => {
request(app)
.get('/')
.expect(200,done)
})
})