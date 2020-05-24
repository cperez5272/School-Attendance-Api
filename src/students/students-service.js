const StudentsService = {
  getAllStudents(knex) {
    return knex.select("*").from("school_attendance_students")
  },
  insertStudent(knex, newStudent) {
    return knex("school_attendance_students").insert(newStudent).returning("id").then(id => {
      return id
    })
  },
  getById(knex, id) {
    return knex.from("school_attendance_students").select("*").where("id", id).first()
  },
  deleteStudent(knex, id) {
    return knex
    .select("*")
    .from("school_attendance_students")

    //.del().then(res => console.log(res))
  },
}


module.exports = StudentsService