// Redis Client
const client = require('../../config/redis')

// Response Helper 
const {
  error,
  success
} = require('../response')

// Lodash
var _ = require('lodash');
const moment = require('moment');

module.exports = {
  getRedisOrders: (req, res, next) => {
    client.get('dataOrders', (err, result) => {
      if (err) {
        // Kalau ada gangguan pas getData
        console.log(err)
      } else {
        if (result) {
          // Ambil data Response
          const response = JSON.parse(result)
          // Ambil parameter yang dibutuhkan
          const page = req.query.page ? Number(req.query.page) : 1
          const limit = req.query.limit ? Number(req.query.limit) : 5
          const offset = page === 1 ? 0 : (page - 1) * limit
          const sort = req.query.sort ? req.query.sort : 'desc'
          const range = req.query.range ? req.query.range : 'year'
          const user = req.query.user ? req.query.user : '%'
          const pending = req.query.pending ? req.query.pending : '%'
          let filterUser = [] 
          if (user != '%') {
            filterUser = _.filter(response, (i) => {
              return (i.userID == user)
            })
          } else {
            filterUser = response
          }
          let filterPending = []
          if (pending != '%') {
            filterPending = _.filter(filterUser, (i) => {
              return (i.isPending == pending)
            })
          }else {
            filterPending = filterUser
          }
          // Data Filter Range Search
          const dataFilter = _.filter(filterPending, (i) => {
            const startDate = moment().format('YYYY-MM-DD') 
            const endDate = moment().subtract(1,`${range}`).format('YYYY-MM-DD')
            let dataDate = moment(i.created_at).format('YYYY-MM-DD')
            return ((dataDate > endDate) && (dataDate <= startDate))
          })
          // Sorting Data
          const dataSorted = _.orderBy(dataFilter, 'created_at', `${sort}`)
          // Data Paginated
          const dataPaginated = _.slice(dataSorted, offset, offset + limit)
          // TodaysOrder
          const filterToday = _.filter(response, (i) => {
            const startDate = moment().format('YYYY-MM-DD') 
            const endDate = moment().subtract(1,`DAY`).format('YYYY-MM-DD')
            let dataDate = moment(i.created_at).format('YYYY-MM-DD')
            return ((dataDate > endDate) && (dataDate <= startDate))
          })
          let todaysIncome = 0
          for(let i = 0; i<filterToday.length;i++){
            todaysIncome = todaysIncome + filterToday[i].total
          }
          // YesterdayOrder
          const filterYesterday = _.filter(response, (i) => {
            const startDate = moment().format('YYYY-MM-DD') 
            const endDate = moment().subtract(1,`DAY`).format('YYYY-MM-DD')
            let dataDate = moment(i.created_at).format('YYYY-MM-DD')
            return ((dataDate >= endDate) && (dataDate < startDate))
          })
          let yesterdayIncome = 0
          for(let i = 0; i<filterYesterday.length;i++){
            yesterdayIncome = yesterdayIncome + filterYesterday[i].total
          }
          // This Week Order
          const filterThisWeek = _.filter(response, (i) => {
            const startDate = moment().format('YYYY-MM-DD') 
            const endDate = moment().subtract(1,`week`).format('YYYY-MM-DD')
            let dataDate = moment(i.created_at).format('YYYY-MM-DD')
            return ((dataDate > endDate) && (dataDate <= startDate))
          })
          // Last Week Order
          const filterLastWeek = _.filter(response, (i) => {
            const startDate = moment().subtract(1,`week`).format('YYYY-MM-DD')
            const endDate = moment().subtract(2,`week`).format('YYYY-MM-DD')
            let dataDate = moment(i.created_at).format('YYYY-MM-DD')
            return ((dataDate > endDate) && (dataDate <= startDate))
          })
          // All Income
          let totalIncome = 0
          for(let i = 0;i<response.length; i++){
            totalIncome = totalIncome+response[i].total
          }
          // Output
          if (dataPaginated.length != 0) {
            const pagination = {
              // Halaman saaat ini
              page,
              // Limit tiap halaman
              limit,
              // Display Range
              range,
              // Total Invoices
              totalOrders: response.length,
              // Banyak Order Minggu Ini
              thisWeekOrders: filterThisWeek.length,
              // Banyak Order Minggu Kemarin 
              lastWeekOrders: filterLastWeek.length,
              // Order Gain Lastweek
              gainOrders: ((filterThisWeek.length-filterLastWeek.length)/filterLastWeek.length)*100,
              // Banyaknya Orders Yang Sesuai
              totalResult: dataFilter.length,
              // Jumlah Halaman
              totalPages: Math.ceil(dataFilter.length / limit),
              // Jumlah Total Pemasukan
              totalIncome,
              // Jumlah Pemasukan Hari Ini
              todaysIncome,
              // Jumlah Pemasukan Kemarin
              yesterdayIncome,
              // Kenaikan Penjualan
              gainIncome: (((todaysIncome-yesterdayIncome)/yesterdayIncome)*100).toFixed(2),
            }
            success(res, 200, 'Display Orders From Redis', pagination, dataPaginated)
          } else {
            error(res, 400, 'No data on this page', '0 Result', {})
          }
          // res.json(response)
        } else {
          next()
        }
      }
    })
  }
}