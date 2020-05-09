const StudentsService = {
    getAllStudents(knex) {
      return knex.select('*').from('school_attendance_students')
    },
    insertStudent(knex, newStudent) {
      return knex
        .insert(newStudent)
        .into('school_attendance_students')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
    getById(knex, id) {
      return knex.from('school_attendance_students').select('*').where('id', id).first()
    },
    deleteStudent(knex, id) {
      return knex('school_attendance_students')
        .where({ id })
        .delete()
    },
    updateStudent(knex, id, newStudentFields) {
      return knex('school_attendance_students')
        .where({ id })
        .update(newStudentFields)
    },
  }


  module.exports = StudentsService