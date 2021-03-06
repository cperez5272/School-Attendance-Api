require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const studentRoutes = require('./students/students-router');

const app = express()

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(express.json());

app.use(studentRoutes);

app.get('/', (req, res) => {
    res.send('Hello, school_attendance_api')
})

app.use(function errorHandler(error, req, res, next) {
    let response
    console.error(error)
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})


app.use(cors())

module.exports = app