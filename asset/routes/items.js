const express = require('express')
const route = express.Router()
const {authToken, authAdmin} = require('../helpers/middleware/auth')

// Ambil Method dari Controller Items
const {
  getAllItems,
  getDetailItems,
  addItems,
  deleteItems,
  patchItems
} = require('../controllers/items')

// Redis Methods
const {getRedisItems} = require('../helpers/redis/items')

// Upload File
const {singleUpload} = require('../helpers/middleware/upload')

// Atur route Items
route
      .get('/items', authToken, getRedisItems, getAllItems)      //Admin & Cashier
      .get('/items/:id', authToken, getDetailItems)              //Admin & Cashier
      .post('/items', authToken, authAdmin, singleUpload, addItems)         //Admin
      .delete('/items/:id', authToken, authAdmin, deleteItems)              //Admin
      .patch('/items/:id', authToken, authAdmin, singleUpload, patchItems)  //Admin

// Exports Modules
module.exports = route