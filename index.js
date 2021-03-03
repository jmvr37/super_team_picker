const express = require('express')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const path = require('path')
const {response} = require('express')
const app = express()
// const cohortsRouter = require('./routes/cohorts')
const knex = require('./db/client')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')

app.set('view engine', 'ejs')
app.use(logger('dev'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())

app.use(express.urlencoded({extended: false}))

app.use(express.static(path.join(__dirname, 'public')))

app.use(
  methodOverride((request, response) => {
    if (request.body && request.body._method) {
      const method = request.body._method

      // Delete method off of "request.body" because we won't be using it after overriding.
      delete request.body._method

      // Whatever is returned from this callback will be the new HTTP verb for the request.
      return method
    }
  }),
)

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
  const teamPicker = request.query.teamPicker
  const quantity = request.query.quantity

  response

  knex('cohorts')
    .where('id', id)
    .first()
    .then(cohort => {
      if (cohort) {
        response.render('cohort', {cohort, teamPicker, quantity})
      } else {
        response.send('cannot find')
      }
    })
})

app.get('/cohorts/:id/edit', (request, response) => {
  const id = request.params.id
  knex('cohorts')
    .where('id', id)
    .first() // when an array is returned as data, only return the first element/object/row
    .then(cohort => {
      if (cohort) {
        response.render('edit', {cohort})
      } else {
        response.send(`<h1>Cannot find article with id: ${id}</h1>`)
      }
    })
})

// articles#update -> PATCH /articles/:id
// Edit an article in the database
app.patch('/cohorts/:id', (request, response) => {
  const id = request.params.id
  const {logo, cohort_name, cohort_members} = request.body

  knex('cohorts')
    .where('id', id)
    .update({
      logo,
      cohort_name,
      cohort_members,
    })
    .then(() => response.redirect(`/cohorts/${id}`))
})

app.delete('/cohorts/:id', (request, response) => {
  const id = request.params.id

  knex('cohorts')
    .where('id', id)
    .del()
    .then(() => {
      console.log(`Deleted cohort with id: ${id}`)
      response.redirect('/cohorts')
    })
})

const PORT = 3000
const ADDRESS = 'localhost'

app.listen(PORT, ADDRESS, () => {
  console.log(`Server started at http://${ADDRESS}:${PORT}`)
})
