const express = require('express')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const path = require('path')
const {response} = require('express')
const app = express()
// const cohortsRouter = require('./routes/cohorts')
const knex = require('./db/client')

app.set('view engine', 'ejs')
app.use(logger('dev'))
app.use(cookieParser())

app.use(express.urlencoded({extended: false}))

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (request, response) => {
  response.send('<h1>Super Team Picker</h1>')
})

// newCohort logic
app.get('/newCohort', (request, response) => {
  response.render('newCohort')
})

app.post('/cohorts', (request, response) => {
  const {logo, cohort_name, cohort_members} = request.body

  knex('cohorts')
    .insert(
      {
        logo,
        cohort_name,
        cohort_members,
      },
      '*',
    )
    .then(data => {
      console.log(data)
      console.log(response)
      // response.redirect('/cohorts')
    })
})
//

const PORT = 3000
const ADDRESS = 'localhost'

app.listen(PORT, ADDRESS, () => {
  console.log(`Server started at http://${ADDRESS}:${PORT}`)
})
