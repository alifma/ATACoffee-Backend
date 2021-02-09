const mySql = require('mysql2')
const {DB_USERNAME,DB_PASSWORD,DB_NAME} = require('../helpers/env')




const connect = mySql.createConnection({
    host:'localhost',
    user:DB_USERNAME,
    password : DB_PASSWORD,
    database:DB_NAME
})

module.exports = connect