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
      .get('/orders', authToken, getRedisOrders, getAllOrders) //Admin & Cashier
      .get('/orders/:inv', authToken, getDetailOrders) //Admin & Cashier
      .post('/orders', authToken, postOrders) //Admin
      .delete('/orders/:inv', authToken, authAdmin, deleteOrders) //Admin
      .patch('/orders/:inv', authToken, authAdmin, updateOrders) //Admin

// Exports Modules
module.exports = route