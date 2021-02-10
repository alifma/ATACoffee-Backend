const express = require('express')
const route = express.Router()
const {authToken, authAdmin} = require('../helpers/middleware/auth')

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
      .get('/categories', authToken, getRedisCtgry, getAllCtgry)      //Admin & Customer
      .get('/categories/:id', authToken, getDetailCtgry)              //Admin & Customer
      .post('/categories', authToken, authAdmin, addCtgry)            //Admin
      .delete('/categories/:id', authToken, authAdmin, deleteCtgry)   //Admin
      .patch('/categories/:id', authToken, authAdmin, updateCtgry)    //Admin

// Exports Modules
module.exports = route