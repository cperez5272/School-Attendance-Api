const knex = require('knex')
const app = require('../src/app')
const { makeAttendanceArray, makeMaliciousAttendance } = require('./attendance.fixtures')

describe('Attendance Endpoints', function() {
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
  
    describe(`GET /students`, () => {
        context(`Given no students`, () => {
            it(`responds with 200 and an empty list`, () => {
            return supertest(app)
                .get('/students')
                .expect(200, [])
            })
        })
  
        context('Given there are students in the database', () => {
            const testAttendance = makeAttendanceArray()

            beforeEach('insert students', () => {
                return db
                .into('school_attendance_students')
                .insert(testAttendance)
            })
    
            it('responds with 200 and all of the students', () => {
            return supertest(app)
                .get('/students')
                .expect(200, testAttendance)
            })
        })
  
        context(`Given an XSS attack students`, () => {
            const { maliciousAttendance, expectedAttendance } = makeMaliciousAttendance()
    
            beforeEach('insert malicious student', () => {
              return db
                .into('school_attendance_students')
                .then(() => {
                  return db
                    .into('school_attendance_students')
                    .insert([ maliciousAttendance ])
                })
            })
    
            it('removes XSS attack content', () => {
            return supertest(app)
                .get(`/students`)
                .expect(200)
                .expect(res => {
                    expect(res.body[0].title).to.eql(expectedAttendance.title)
                    expect(res.body[0].content).to.eql(expectedAttendance.content)
                })
            })
        })
    })
  
    describe(`POST /students`, () => {
      it(`creates an student, responding with 201 and the new student`, () => {
        const newAttendance = {
          firstName: 'Test first name student',
          lastName: 'Test last name student',
          grade: 7,
        }
        return supertest(app)
          .post('/students')
          .send(newAttendance)
          .expect(201)
          .expect(res => {
            expect(res.body.firstName).to.eql(newAttendance.firstName)
            expect(res.body.lastName).to.eql(newAttendance.lastName)
          })
          .then(res =>
            supertest(app)
              .get(`/students/${res.body.id}`)
              .expect(res.body)
          )
      })
    })
  })