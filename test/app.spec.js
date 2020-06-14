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
      first_name: 'john',
      last_name: 'test',
      grade: 7,
    }
    it('first_name should be "john"', function(done) {
    supertest(app)
      .post('/students')
      .send(newAttendance)
      .set('Accept', 'application/json')
      .expect(function(res) {
        // res.body.id = 'some fixed id';
        res.body.first_name = res.body.first_name.toLowerCase();
        res.body.last_name = res.body.last_name.toLowerCase();
        res.body.grade = res.body.grade
      })
      .expect(200, {
        // id: 'some fixed id',
        first_name: 'john',
        last_name: 'test'
      }, done());
    });
  })
});