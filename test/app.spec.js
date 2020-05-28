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

describe('App', () => {
  it('GET /students responds with 200 "student added"', () => {
    return supertest(app)
    .get('/students')
    .expect(200, 'student added')
  })
})