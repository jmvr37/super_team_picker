const express = require('express')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const path = require('path')
const {response} = require('express')
//const knex = require("./db/client");
const app = express()
const cohortsRouter = require('./routes/cohorts')

app.set('view engine', 'ejs')
app.use(logger('dev'))
app.use(cookieParser())

app.use(express.urlencoded({extended: false}))

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (request, response) => {
  response.send('<h1>Super Team Picker</h1>')
})

app.get('/newCohort', cohortsRouter)

const PORT = 3000
const ADDRESS = 'localhost'
app.listen(PORT, ADDRESS, () => {
  console.log(`Server started at http://${ADDRESS}:${PORT}`)
})
