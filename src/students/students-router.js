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
    firstName: xss(student.firstname),
    lastName: xss(student.lastname),
    grade: student.grade,
  })

  studentsRouter
  .route('/students')
  .get((req, res, next) => {
    const knexInstance = req.app.get("db")

    StudentsService.getAllStudents(knexInstance)
    
      .then(students =>  res.json(students.map(serializeStudent)))
      .catch(next)
  })

  studentsRouter
  .post('/students', async (req, res, next) => {
    console.log(req.body, typeof req.body.grade)
    const { firstName, lastName, grade } = req.body
    const newStudent = { firstname: firstName, lastname: lastName, grade };
    res.send(newStudent);
    try {
      StudentsService.insertStudent(
        req.app.get("db"),
        newStudent
      )
    } catch (error) {
      console.dir(error);
    }
    //for (const [key, value] of Object.entries(newStudent))
    //  if (value == null)
    //    return res.status(400).json({
    //      error: { message: `Missing '${key}' in request body` }
    //    })
   
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