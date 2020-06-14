const express = require('express')
const path = require('path')
const xss = require('xss')
const StudentsService = require('./students-service')

const studentsRouter = express.Router()
const jsonParser = express.json()

const serializeStudent = student => ({
    id: student.id,
    first_name: student.first_name,
    last_name: student.last_name,
    grade: student.grade,
  })

  studentsRouter
  .route('/students')
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    StudentsService.getAllStudents(knexInstance)
      .then(students =>  res.json(students))
      .catch(next)
  })

  studentsRouter
  .post('/students', async (req, res, next) => {
    const { first_name, last_name, grade } = req.body
    const newStudent = { first_name: first_name, last_name: last_name, grade };
    try {
      StudentsService.insertStudent(
        req.app.get("db"),
        newStudent
      ).then(r => {
        res.send(r);
      })
    } catch (error) {
      console.dir(error);
    }
  })

  studentsRouter
  .route('/remove-students')
  .delete((req, res, next) => {
    StudentsService.deleteStudent(
      req.app.get('db')
    ).then(r => {
        res.send({response: r, status: 204});
    }).catch(next)
  })

  module.exports = studentsRouter;