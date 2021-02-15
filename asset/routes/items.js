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
      .get('/api/items', getRedisItems, getAllItems)                 //Admin & Customer
      .get('/api/items/:id', authToken, getDetailItems)                         //Admin & Customer
      .post('/api/items', authToken, authAdmin, singleUpload, addItems)         //Admin
      .delete('/api/items/:id', authToken, authAdmin, deleteItems)              //Admin
      .patch('/api/items/:id', authToken, authAdmin, singleUpload, patchItems)  //Admin

// Exports Modules
module.exports = route