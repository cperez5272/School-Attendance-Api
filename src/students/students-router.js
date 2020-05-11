// const express = require('express');
// const router = express.Router();

// router.get('/students', async (req, res) => {
//     console.log(req.app.get('db'));
//     res.send(req.app.get('db'));
// })

// module.exports = router; 

const express = require('express')
const path = require('path')
const xss = require('xss')
const StudentsService = require('./students-service')

const studentsRouter = express.Router()
const jsonParser = express.json()

const serializeStudent = student => ({
  id: student.id,
  firstName: xss(student.firstName),
  lastName: xss(student.lastName),
  grade: student.grade,
})

studentsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    StudentsService.getAllStudents(knexInstance)
    
      .then(students => {
          console.log(students)
        res.json(students.map(serializeStudent))
      })
      .catch(next)
  })

  .post(jsonParser, (req, res, next) => {
    const { firstName, lastName, grade } = req.body
    const newStudent = { firstName, lastName, grade }

    for (const [key, value] of Object.entries(newStudent))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
    StudentsService.insertStudent(
      req.app.get('db'),
      newStudent
    )
      .then(student => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${student.id}`))
          .json(serializeStudent(student))
      })
      .catch(next)
  })
  
  studentsRouter
  .route('/:student_id')
  .all((req, res, next) => {
    StudentsService.getById(
      req.app.get('db'),
      req.params.student_id
    )
      .then(student => {
        if (!student) {
          return res.status(404).json({
            error: { message: `Student doesn't exist` }
          })
        }
        res.student = student
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeStudent(res.student))
  })
  .delete((req, res, next) => {
    StudentsService.deleteStudent(
      req.app.get('db'),
      req.params.student_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { firstName, lastName } = req.body
    const studentToUpdate = { firstName, lastName }

    const numberOfValues = Object.values(studentToUpdate).filter(Boolean).length
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain 'firstName, lastName'`
        }
      })
    }

    studentsService.updateStudent(
        req.app.get('db'),
        req.params.student_id,
        studentToUpdate
      )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
    })
  
  module.exports = studentsRouter