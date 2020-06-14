const StudentsService = {
  getAllStudents(knex) {
    const students = knex.select("*").from("school_attendance_students").then(r => {
      return r;
    })
    return students;
  },
  insertStudent(knex, newStudent) {
    return knex("school_attendance_students").insert(newStudent).returning("id").then(id => {
      newStudent.id = id[0];
      return newStudent;
    })
  },
  getById(knex, id) {
    return knex.from("school_attendance_students").select("*").where("id", id).first()
  },
  deleteStudent(knex) {
    return knex.raw(`
      DELETE FROM school_attendance_students WHERE first_name IS NOT NULL
    `)
  },
}


module.exports = StudentsService