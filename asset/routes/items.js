const express = require('express')
const route = express.Router()

// Ambil Method dari Controller Menus
const {
  getAllItems,
  getDetailItems,
  addItems,
  deleteItems,
  patchItems
} = require('../controllers/items')

// Redis Methods
// const {getRedisMenus} = require('../helpers/redis/menus')

// Auth & Authorize
// const {authentication, authorizeAdmin} = require('../helpers/middleware/auth')

// Upload File
const {singleUpload} = require('../helpers/middleware/upload')

// Atur route menus
route
      .get('/items', getAllItems)       //Admin & Cashier
      .get('/items/:id', getDetailItems)//Admin & Cashier
      .post('/items', singleUpload, addItems)         //Admin
      .delete('/items/:id', deleteItems)              //Admin
      .patch('/items/:id', singleUpload, patchItems)  //Admin

// Exports Modules
module.exports = route