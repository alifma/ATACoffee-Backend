const express = require('express')
const route = express.Router()

// Ambil Method dari Controller Orders
const {
  postOrders,
  updateOrders,
  deleteOrders
} = require('../controllers/orders')

// Redis Methods
// const {getRedisOrders} = require('../helpers/redis/orders')

// Atur route Items
route
      // .get('/orders', getRedisItems, getAllItems)      //Admin & Cashier
      // .get('/orders/:inv', getDetailItems)              //Admin & Cashier
      .post('/orders', postOrders)         //Admin
      .delete('/orders/:inv', deleteOrders)              //Admin
      .patch('/orders/:inv', updateOrders)  //Admin

// Exports Modules
module.exports = route