const express = require('express')
const route = express.Router()

// Ambil Method dari Controller Menus
const {
  getAllItems
} = require('../controllers/items')

// Redis Methods
// const {getRedisMenus} = require('../helpers/redis/menus')

// Auth & Authorize
// const {authentication, authorizeAdmin} = require('../helpers/middleware/auth')

// Upload File
// const {singleUpload} = require('../helpers/middleware/upload')

// Atur route menus
route
      .get('/items', getAllItems)                          //Admin & Cashier
      // .get('/items/:id',  getDetailMenus)                              //Admin & Cashier
      // .post('/items', addMenus)         //Admin
      // .delete('/items/:id', deleteMenus)              //Admin
      // .patch('/items/:id', patchMenus)  //Admin

// Exports Modules
module.exports = route