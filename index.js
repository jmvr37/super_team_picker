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

app.get('/cohorts', (request, response) => {
  knex
    .select('*')
    .from('cohorts')
    .then(data => {
      response.render('cohorts', {cohorts: data})
    })
})

app.post('/cohort', (request, response) => {
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
      response.send(data)
      response.redirect('/cohort')
    })
})
//

app.get('/cohorts/:id', (request, response) => {
  const id = request.params.id

  console.log(`REQ PARAMS: ${request.params.id}`)
  console.log(`ID: ${id}`)
  response

  knex('cohorts')
    .where('id', id)
    .first()
    .then(cohort => {
      if (cohort) {
        response.render('cohort', {cohort})
      } else {
        response.send('cannot find')
      }
    })
})
// showCohort logic
// app.get('/:id', async (request, response) => {
//   console.log(`Params: ${request.params}`)
//   console.log(`Body: ${request.body}`)
//   console.log(`Query: ${request.query}`)
// const cohortID = request.params.id
// const cohort = await knex('cohorts').where('id', cohortID).first()
// knex
//   .select('*')
//   .from('cohorts')
//   .then(data => {
//     response.render('cohorts', {cohort})
//   })
// if (cohort) {
//   response.render('cohorts', {cohort})
// } else {
//   response.send(`<h1>Cannot find article with id: ${id}</h1>`)
// }
// })

const PORT = 3000
const ADDRESS = 'localhost'

app.listen(PORT, ADDRESS, () => {
  console.log(`Server started at http://${ADDRESS}:${PORT}`)
})
