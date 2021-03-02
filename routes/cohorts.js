const knex = require('../db/client')
const router = require('express').Router()

router.get('/newCohort', (request, response) => {
  response.render('newCohort')
})

router.post('/', (request, response) => {
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
      response.send(data)
    })
})

module.exports = router
