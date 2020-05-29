const { expect } = require('chai')
const supertest = require('supertest')
const app = require('../src/app')

describe('App', () => {
  it('GET / responds with 200 containing "school_attendance_api"', () => {
    return supertest(app)
      .get('/')
      .expect(200, 'Hello, school_attendance_api')
  })
})

describe('POST /students', function() {
  it('firstName should be "john"', function(done) {
    supertest(app)
      .post('/students')
      .send('name=john')
      .set('Accept', 'application/json')
      .expect(function(res) {
        res.body.id = 'some fixed id';
        res.body.firstName = res.body.firstName.toLowerCase();
      })
      .expect(200, {
        id: 'some fixed id',
        name: 'john'
      }, done);
  });
});