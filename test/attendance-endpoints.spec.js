const knex = require('knex')
const app = require('../src/app')
const { makeAttendanceArray, makeMaliciousAttendance } = require('./attendance.fixtures')
// const { makeUsersArray } = require('./users.fixtures')

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
        context(`Given no articles`, () => {
            it(`responds with 200 and an empty list`, () => {
            return supertest(app)
                .get('/students')
                .expect(200, [])
            })
        })
  
        context('Given there are students in the database', () => {
            // const testUsers = makeUsersArray()
            const testAttendance = makeAttendanceArray()

            beforeEach('insert students', () => {
              return db
                .into('school_attendance_students')
                // .insert(testUsers)
                .then(() => {
                  return db
                    .into('school_attendance_students')
                    .insert(testAttendance)
                })
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
                // .insert(testUsers)
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
  
    describe(`GET /students/:student_id`, () => {
        context(`Given no students`, () => {
        it(`responds with 404`, () => {
            const studentId = 123456
            return supertest(app)
                .get(`/students/${studentId}`)
                .expect(404, { error: { message: `Student doesn't exist` } })
        })
        })
  
        context('Given there are students in the database', () => {
            const testAttendance = makeAttendanceArray()
            // const testUsers = makeUsersArray()

            beforeEach('insert articles', () => {
              return db
                .into('school_attendance_students')
                // .insert(testUsers)
                .then(() => {
                  return db
                    .into('school_attendance_students')
                    .insert(testAttendance)
                })
            })
    
            it('responds with 200 and the specified student', () => {
            const studentId = 2
            const expectedAttendance = testAttendance[studentId - 1]
            return supertest(app)
                .get(`/students/${studentId}`)
                .expect(200, expectedAttendance)
            })
        })
  
        context(`Given an XSS attack article`, () => {
            // const testUsers = makeUsersArray()
            const { maliciousAttendance, expectedAttendance } = makeMaliciousAttendance()

            beforeEach('insert malicious article', () => {
              return db
                .into('school_attendance_students')
                // .insert(testUsers)
                .then(() => {
                  return db
                    .into('school_attendance_students')
                    .insert([ maliciousAttendance ])
                })
            })
    
            it('removes XSS attack content', () => {
            return supertest(app)
                .get(`/students/${maliciousAttendance.id}`)
                .expect(200)
                .expect(res => {
                    expect(res.body.title).to.eql(expectedAttendance.title)
                    expect(res.body.content).to.eql(expectedAttendance.content)
                })
            })
        })
    })
  
    describe(`a /students`, () => {
      it(`creates an student, responding with 201 and the new student`, () => {
        const newAttendance = {
          firstname: 'Test first name student',
          lastname: 'Test last name student',
        //   grade: 'Test new student grade...'
        }
        return supertest(app)
          .post('/students')
          .send(newAttendance)
          .expect(201)
          .expect(res => {
            expect(res.body.firstname).to.eql(newAttendance.firstname)
            expect(res.body.lastname).to.eql(newAttendance.lastname)
            // expect(res.body.content).to.eql(newAttendance.content)
            // expect(res.body).to.have.property('id')
            // expect(res.headers.location).to.eql(`/api/articles/${res.body.id}`)
            // const expected = new Date().toLocaleString()
            // const actual = new Date(res.body.date_published).toLocaleString()
            // expect(actual).to.eql(expected)
          })
          .then(res =>
            supertest(app)
              .get(`/students/${res.body.id}`)
              .expect(res.body)
          )
      })
  
      const requiredFields = ['firstname', 'lastname', 'grade']
  
      requiredFields.forEach(field => {
        const newAttendance = {
          firstname: 'Test first name student',
          lastname: 'Test last name student',
        //   content: 'Test new article content...'
        }
  
        it(`responds with 400 and an error message when the '${field}' is missing`, () => {
          delete newAttendance[field]
  
          return supertest(app)
            .post('/students')
            .send(newAttendance)
            .expect(400, {
              error: { message: `Missing '${field}' in request body` }
            })
        })
      })
  
      it('removes XSS attack content from response', () => {
        const { maliciousAttendance, expectedAttendance } = makeMaliciousAttendance()
        return supertest(app)
          .post(`/students`)
          .send(maliciousAttendance)
          .expect(201)
          .expect(res => {
            expect(res.body.title).to.eql(expectedAttendance.title)
            expect(res.body.content).to.eql(expectedAttendance.content)
          })
      })
    })
  
    describe(`DELETE /remove-students`, () => {
      context(`Given no students`, () => {
        it(`responds with 404`, () => {
          const studentId = 123456
          return supertest(app)
            .delete(`/remove-students/${studentId}`)
            .expect(404, { error: { message: `Student doesn't exist` } })
        })
      })
  
      context('Given there are students in the database', () => {
        const testAttendance = makeAttendanceArray()
        // const testUsers = makeUsersArray()
  
        beforeEach('insert students', () => {
          return db
            .into('school_attendance_students')
            // .insert(testUsers)
            .then(() => {
              return db
                .into('school_attendance_students')
                .insert(testAttendance)
            })
        })
  
        it('responds with 204 and removes the student', () => {
          const idToRemove = 2
          const expectedAttendance = testAttendance.filter(attendance => attendance.id !== idToRemove)
          return supertest(app)
            .delete(`/remove-students/${idToRemove}`)
            .expect(204)
            .then(res =>
              supertest(app)
                .get(`/students`)
                .expect(expectedAttendance)
            )
        })
      })
    })

    // describe(`PATCH /api/articles/:article_id`, () => {
    //   context(`Given no articles`, () => {
    //     it(`responds with 404`, () => {
    //       const articleId = 123456
    //       return supertest(app)
    //         .delete(`/api/articles/${articleId}`)
    //         .expect(404, { error: { message: `Article doesn't exist` } })
    //     })
    //   })

    //   context('Given there are articles in the database', () => {
    //     const testArticles = makeArticlesArray()
    //     const testUsers = makeUsersArray()

    //     beforeEach('insert articles', () => {
    //       return db
    //         .into('blogful_users')
    //         .insert(testUsers)
    //         .then(() => {
    //           return db
    //             .into('blogful_articles')
    //             .insert(testArticles)
    //         })
    //     })

    //     it('responds with 204 and updates the article', () => {
    //       const idToUpdate = 2
    //       const updateArticle = {
    //         title: 'updated article title',
    //         style: 'Interview',
    //         content: 'updated article content',
    //       }
    //       const expectedArticle = {
    //         ...testArticles[idToUpdate - 1],
    //         ...updateArticle
    //       }
    //       return supertest(app)
    //         .patch(`/api/articles/${idToUpdate}`)
    //         .send(updateArticle)
    //         .expect(204)
    //         .then(res =>
    //           supertest(app)
    //             .get(`/api/articles/${idToUpdate}`)
    //             .expect(expectedArticle)
    //         )
    //     })

    //     it(`responds with 400 when no required fields supplied`, () => {
    //       const idToUpdate = 2
    //       return supertest(app)
    //         .patch(`/api/articles/${idToUpdate}`)
    //         .send({ irrelevantField: 'foo' })
    //         .expect(400, {
    //           error: {
    //             message: `Request body must contain either 'title', 'style', or 'content'`
    //           }
    //         })
    //     })

    //     it(`responds with 204 when updating only a subset of fields`, () => {
    //       const idToUpdate = 2
    //       const updateArticle = {
    //         title: 'updated article title',
    //       }
    //       const expectedArticle = {
    //         ...testArticles[idToUpdate - 1],
    //         ...updateArticle
    //       }

    //       return supertest(app)
    //         .patch(`/api/articles/${idToUpdate}`)
    //         .send({
    //           ...updateArticle,
    //           fieldToIgnore: 'should not be in GET response'
    //         })
    //         .expect(204)
    //         .then(res => 
    //             supertest(app)
    //               .get(`/api/articles/${idToUpdate}`)
    //               .expect(expectedArticle)
    //         )
    //     })
    //   })
    // })
  })