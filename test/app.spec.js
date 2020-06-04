const { expect } = require('chai')
const supertest = require('supertest')
const app = require('../src/app')
const knex = require('knex')

describe('App', () => {
  it('GET / responds with 200 containing "school_attendance_api"', () => {
    return supertest(app)
      .get('/')
      .expect(200, 'Hello, school_attendance_api')
  })
})



describe('Post Endpoint', function() {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db.raw('TRUNCATE school_attendance_students RESTART IDENTITY CASCADE'))

  afterEach('cleanup', () => db.raw('TRUNCATE school_attendance_students RESTART IDENTITY CASCADE'))

  describe('POST /students', function() {
    const newAttendance = {
      firstname: 'john',
      lastname: 'test',
      grade: 7,
    }
    it('firstname should be "john"', function(done) {
    supertest(app)
      .post('/students')
      .send(newAttendance)
      .set('Accept', 'application/json')
      .expect(function(res) {
        // res.body.id = 'some fixed id';
        res.body.firstname = res.body.firstname.toLowerCase();
        res.body.lastname = res.body.lastname.toLowerCase();
        res.body.grade = res.body.grade
      })
      .expect(200, {
        // id: 'some fixed id',
        firstName: 'john',
        lastName: 'test'
      }, done());
    });
  })
});