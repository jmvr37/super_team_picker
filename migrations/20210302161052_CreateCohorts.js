exports.up = function (knex) {
  return knex.schema.createTable('cohorts', table => {
    table.bigIncrements('id')
    table.string('logo')
    table.string('cohort_name')
    table.string('cohort_members')
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('cohorts')
}
