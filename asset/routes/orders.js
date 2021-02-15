const express = require('express')
const route = express.Router()
const {
      authToken,
      authAdmin
} = require('../helpers/middleware/auth')

// Ambil Method dari Controller Orders
const {
      getAllOrders,
      getDetailOrders,
      postOrders,
      updateOrders,
      deleteOrders
} = require('../controllers/orders')

// Redis Methods
const {
      getRedisOrders
} = require('../helpers/redis/orders')

// Atur route Items
route
      .get('/api/orders', authToken, getRedisOrders, getAllOrders)    //Admin & Customer
      .get('/api/orders/:inv', authToken, getDetailOrders)            //Admin & Customer
      .post('/api/orders', authToken, postOrders)                     //Admin & Customer
      .delete('/api/orders/:inv', authToken, deleteOrders)            //Admin & Customer
      .patch('/api/orders/:inv', authToken, authAdmin, updateOrders)  //Admin

// Exports Modules
module.exports = route