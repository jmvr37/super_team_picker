const knex = require('../db/client')
const router = require('express').Router()

router.get('/newCohort', (request, response) => {
  response.render('newCohort')
})

router.post('/cohorts', (request, response) => {
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

module.exports = router

// app.get("/contact", (request, response) => {
//   knex
//     .select("*")
//     .from("contacts")
//     .then((data) => {
//       // array of objects
//       console.log(data);
//       response.render("contact", { contacts: data });
//     });
// });
