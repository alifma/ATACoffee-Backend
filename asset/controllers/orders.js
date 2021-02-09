// Model Items
const {
  modelPostBodyOrder,
  modelPostHeadOrder,
  modelUpdateHeadOrder,
  modelUpdateBodyOrder,
  modelDeleteOrder,
} = require('../models/orders')

// Redis Client
// const redisClient = require('../config/redis');

// Remove File Operation
// const fs = require('fs')

// Response Helper 
const {
  error,
  success
} = require('../helpers/response')

// MomentJS
const moment = require('moment');

const {
  isUndefined
} = require('lodash');

module.exports = {
  postOrders: (req, res) => {
    try {
        // Ambil data dari body
        const data = req.body
        // Inisialisasi Checker
        let dataChecker = false
        for(let i = 0; i<data.length;i++) {
            if(data[i].inv && data[i].userID && data[i].userName && data[i].itemName && data[i].size && data[i].amount && data[i].price  && data[i].cashierID && data[i].orderType && data[i].orderDetails && data[i].orderPhone &&  data[i].paymentType ){
                dataChecker = true
            }else{
                dataChecker = false
                break
            }
        }
        if (dataChecker) {
            let total = 0
            for(let i = 0; i<data.length;i++) {
                total = total + (data[i].price * data[i].amount)
            }
            const dataHead = {
              "inv":data[0].inv, 
              "cashierID":data[0].cashierID, 
              "userID":data[0].userID,
              "userName":data[0].userName,
              "orderType":data[0].orderType,
              "orderDetails":data[0].orderDetails,
              "orderPhone":data[0].orderPhone,
              "paymentType":data[0].paymentType,
              "total": total}
            modelPostBodyOrder(data)
                .then(() => {
                    // Post Head Data
                    modelPostHeadOrder(dataHead)
                    .then(()=> {
                      success(res, 200, 'Add Order Success', {}, {})
                    })
                    // Set Data ke Redis
                    // module.exports.setRedisOrders()
                    // Kalau berhasil menambahkan
                    .catch((err) => {
                      error(res, 400, 'Update Head error', err.message, {})
                    })
                })
                .catch((err) => {
                    // Kalau ada tipe data yang salah
                    error(res, 400, 'Wrong Data Type Given', err.message, {})
                })
        } else {
            // Kalau ada data yang kosong
            error(res, 400, 'Please Fill All Field', 'Empty field found', {})
        }
    } catch (err) {
        // Kalau ada salah lainnya
        error(res, 500, 'Internal Server Error', err.message, {})
    }
  },

  updateOrders: (req, res) => {
    try {
        const inv = req.params.inv
        const currDate = moment().format('YYYY-MM-DDThh:mm:ss.ms')
        const data = {
            'isPending': req.body.isPending,
            'updated_at': currDate
        }
        const dataHead = {
          ...data,
          'cashierID': req.body.cashierID 
        }
        modelUpdateBodyOrder(data, inv)
            .then((response) => {
                if (response.affectedRows != 0) {
                  
                    modelUpdateHeadOrder(dataHead , inv)
                    .then((response) => {
                        if (response.affectedRows != 0) {
                            // Set Data ke Redis
                            // module.exports.setRedisOrders()
                            // Kalau berhasil mengupdate
                            success(res, 200, 'Update Order Success', {}, {})
                        } else {
                            // Kalau salah ID hapus
                            error(res, 400, 'Nothing Updated, Wrong ID', '0 Result', {})
                        }
                    })
                    .catch((err) => {
                        // Kalau misalkan ada error dari model
                        error(res, 400, 'Wrong Data Type Given', err.message, {})
                    })
                } else {
                    // Kalau salah ID hapus
                    error(res, 400, 'Nothing Updated, Wrong ID', '0 Result', {})
                }
            })
            .catch((err) => {
                // Kalau misalkan ada error dari model
                error(res, 400, 'Wrong Data Type Given', err.message, {})
            })
    } catch (err) {
        // Kalau ada salah lainnya
        error(res, 500, 'Internal Server Error', err.message, {})
    }
  },

  // Hapus semua order berdasarkan invoice
  deleteOrders: (req, res) => {
    try {
      const inv = req.params.inv
      modelDeleteOrder(inv)
        .then((response) => {
          if (response.affectedRows != 0) {
            // Set Data ke Redis
            // module.exports.setRedisOrders()
            // Kalau ada yang terhapus
            success(res, 200, 'Delete Order Sucess', {}, {})
          } else {
            // Kalau tidak ada yang terhapus
            error(res, 400, 'Nothing Deleted, Wrong Invoice', '0 Result', {})
          }
        })
        .catch((err) => {
          // Kalau ada salah di parameternya
          error(res, 400, 'Wrong Parameter Type', err.message, {})
        })
    } catch (err) {
      // Kalau ada salah lainnya
      error(res, 500, 'Internal Server Error', err.message, {})
    }
  },
}