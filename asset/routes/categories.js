const express = require('express')
const route = express.Router()

// Ambil Method dari Controller Categories
const {
  getAllCtgry,
  getDetailCtgry,
  addCtgry,
  updateCtgry,
  deleteCtgry
} = require('../controllers/categories')

// Redis Methods
const {getRedisCtgry} = require('../helpers/redis/categories')

// Atur route Categories
route
      .get('/categories', getRedisCtgry, getAllCtgry)  //Admin & Cashier
      .get('/categories/:id', getDetailCtgry)   //Admin & Cashier
      .post('/categories', addCtgry)            //Admin
      .delete('/categories/:id', deleteCtgry)   //Admin
      .patch('/categories/:id', updateCtgry)    //Admin

// Exports Modules
module.exports = route