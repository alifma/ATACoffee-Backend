// Model Items
const {
  modelAllOrder,
  modelDetailHead,
  modelDetailOrder,
  modelPostBodyOrder,
  modelPostHeadOrder,
  modelUpdateHeadOrder,
  modelUpdateBodyOrder,
  modelDeleteOrder,
  modelRedisOrder,
  modelTotalIncome,
  modelTotalItems,
  modelTotalOrders,
  modelTotalRange,
  modelTotalYesterday,
  modelTotalLastWeek
} = require('../models/orders')

// Redis Client
const redisClient = require('../config/redis');

// Response Helper 
const {
  error,
  success
} = require('../helpers/response')

// MomentJS
const moment = require('moment');
const { toUpper } = require('lodash');

module.exports = {
  // Lempar All Orders ke Redist
  setRedisOrders: (req, res) => {
    // Panggil Models All Orders
    modelRedisOrder().then((response) => {
        // Ubah Response jadi String agar bisa disimpan di redis
        const data = JSON.stringify(response)
        // Set Data ke RedisClient
        redisClient.set('dataOrdersATA', data)
    }).catch((err) => {
        // Kalua ada Error
        error(res, 500, 'Internal Server Redis Error', err.message, {})
    })
  },
  getAllOrders: async (req, res) => {
    try {
        // Ambil Query dari URL
        const limit = req.query.limit ? req.query.limit : '5'
        const sort = req.query.sort ? req.query.sort : 'desc'
        const range = req.query.range ? toUpper(req.query.range) : 'YEAR'
        const page = req.query.page ? req.query.page : '1'
        const offset = page === 1 ? 0 : (page - 1) * limit
        const user = req.query.user ? req.query.user : '%'
        const pending = req.query.pending ? req.query.pending : '%'
        // Ambil Dari Modal pakai Await
        const allIncome       = await modelTotalIncome()
        const total           = await modelTotalItems(range, pending, user)
        const tdyIncome       = await modelTotalRange('day')
        const incomeYesterday = await modelTotalYesterday()
        const ordersAll       = await modelTotalOrders('YEAR', pending)
        const ordersLastweek  = await modelTotalLastWeek()
        const ordersThisWeek  = await modelTotalOrders('WEEK', pending)
        modelAllOrder(offset, limit, sort, range, user, pending)
            .then((response) => {
                if (response.length != 0) {
                    const pagination= {
                        // Halaman yang sedang diakses
                        page,
                        // Batasan Banyaknya hasil per halaman
                        limit,
                        // range data yang sedang ditampilkan
                        range,
                        // Banyaknya Invoices yang terdaftar
                        allOrders: ordersAll[0].total,
                        // Banyak Order Minggu ini
                        thisWeekOrders: ordersThisWeek[0].total,
                        // Banyak Order Minggu kemarin
                        lastWeekOrders: ordersLastweek[0].total,
                        // Order Gain Lastweek
                        gainOrders: ((ordersThisWeek[0].total-ordersLastweek[0].total)/ordersLastweek[0].total)*100,
                        // Banyaknya Orders Yang Sesuai
                        totalResult: total[0].total,
                        // Jumlah Halaman
                        totalPages: Math.ceil(total[0].total / limit),
                        // Jumlah Total Pemasukan
                        totalIncome: Number(allIncome[0].totalIncome),
                        // Jumlah Pemasukan Hari Ini
                        todaysIncome: Number(tdyIncome[0].totalIncome),
                        // Jumlah Pemasukan Kemarin
                        YesterdayIncome: Number(incomeYesterday[0].yesterdayIncome),
                        // Kenaikan Penjualan
                        gainIncome: (((tdyIncome[0].totalIncome-incomeYesterday[0].yesterdayIncome)/incomeYesterday[0].yesterdayIncome)*100).toFixed(2),
                    }
                    // Set Data ke Redis
                    module.exports.setRedisOrders()
                    // Kalau hasilnya bukan array kosong
                    success(res, 200, 'Display All Order Success', pagination, response)
                } else {
                    // Kalau hasilnya array kosong
                    error(res, 400, 'No data on this page', '0 Result', {})
                }
            })
            .catch((err) => {
                // Kalau Ada salah di Query
                error(res, 400, 'Wrong Query Given', err.message, {})
            })
    } catch (err) {
        // Kalau ada salah lainnya
        error(res, 500, 'Internal Server Error', err.message, {})
    }
},
  // Tampilkan Detail Item Tiap Invoices
  getDetailOrders: (req, res) => {
    try {
        // Ambil data dari parameter
        const inv = req.params.inv
        modelDetailOrder(inv)
            .then((response) => {
                if (response.length != 0) {
                  modelDetailHead(inv)
                  .then((headRes) => {
                    // Kalau ada datanya
                    success(res, 200, 'Show Detail Data Success', {}, {head: headRes, body: response})
                  })
                  .catch((err) => {
                    // Kalau salah parameternya
                    error(res, 400, 'Wrong Parameter Type', err.message, {})
                  })
                } else {
                    // kalau tidak ada datanya
                    error(res, 400, 'Data Not Found, Wrong Invoice', '0 Result', {})
                }
            })
            .catch((err) => {
                // Kalau salah parameternya
                error(res, 400, 'Wrong Parameter Type', err.message, {})
            })
    } catch (err) {
        // Kalau ada salah lainnya
        error(res, 500, 'Internal Server Error', err.message, {})
    }
  },

  postOrders: (req, res) => {
    try {
        // Ambil data dari body
        const data = req.body
        // Inisialisasi Checker
        let dataChecker = false
        for(let i = 0; i<data.length;i++) {
            if(data[i].inv && data[i].userID && data[i].userName && data[i].itemName && data[i].itemImage && data[i].size && data[i].amount && data[i].price && data[i].orderType && data[i].orderDetails && data[i].orderPhone &&  data[i].paymentType ){
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
              "userName":data[0].userName,
              "orderType":data[0].orderType,
              "orderDetails":data[0].orderDetails,
              "orderPhone":data[0].orderPhone,
              "paymentType":data[0].paymentType,
              "total": total}
            modelPostBodyOrder(data)
                .then(async () => {
                    // Post Head Data
                    await modelPostHeadOrder(dataHead)
                    .then(()=> {
                      // Set Data ke Redis
                      module.exports.setRedisOrders()
                      success(res, 200, 'Add New Order Success', {}, {})
                    })
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
          'cashierName': req.body.cashierName
        }
        modelUpdateBodyOrder(data, inv)
            .then((response) => {
                if (response.affectedRows != 0) {
                    modelUpdateHeadOrder(dataHead , inv)
                    .then((response) => {
                        if (response.affectedRows != 0) {
                            // Set Data ke Redis
                            module.exports.setRedisOrders()
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
            module.exports.setRedisOrders()
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