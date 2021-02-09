const express = require('express')
const route = express.Router()

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
      .get('/items', getRedisItems, getAllItems)      //Admin & Cashier
      .get('/items/:id', getDetailItems)              //Admin & Cashier
      .post('/items', singleUpload, addItems)         //Admin
      .delete('/items/:id', deleteItems)              //Admin
      .patch('/items/:id', singleUpload, patchItems)  //Admin

// Exports Modules
module.exports = route