// Model Items
const {
  modelAllItems,
  modelDetailItems,
  modelAddItems,
  modelDeleteItems, 
  modelPatchItems,
  modelTotalItems,
  modelResultItems,
  modelRedisItems
} = require('../models/items')


// MomentJS
const moment = require('moment');

module.exports = {
  // Tampilkan Semua Menu yang aktif
  getAllItems: async (req, res) => {
    try {
      // Ambil Query dari URL
      const limit = req.query.limit ? Number(req.query.limit) : 9
      const page = req.query.page ? Number(req.query.page) : 1
      const name = req.query.name ? req.query.name : ''
      const offset = page === 1 ? 0 : (page - 1) * limit
      const orderby = req.query.order ? req.query.order : 'id'
      const sort = req.query.sort ? req.query.sort : 'ASC'
      // Ambil dari Modal pakai Await
      const total = await modelTotalItems()
      const totalResult = await modelResultItems(name)
      modelAllItems(name, offset, limit, orderby, sort)
        .then((response) => {
          if (response.length != 0) {
            const arr = response.map(i => ({
              ...i,
              isClicked: false
            }))
            const pagination = {
              // Halaman Saat Ini
              page: page,
              // Limit Tiap Halaman
              limit: limit,
              // Semua menu yang aktif
              totalMenus: total[0].total,
              // Semua menu yang Sesuai Query
              totalResult: totalResult[0].total,
              // Jumlah Page yang Sesuai Query
              pageResult: Math.ceil(totalResult[0].total / limit),
            }
            // Set data ke Redis
            module.exports.setRedisMenus()
            // Kalau arraynya ada isinya
            success(res, 200, 'Display Menu Success', pagination, arr)
          } else {
            // Kalau arraynya kosong
            error(res, 400, 'No data on this page', '0 Result', {})
          }
        })
        .catch((err) => {
          // Kalau ada problem dari query nya
          error(res, 400, 'Wrong Query Given', err.message, {})
        })
    } catch (err) {
      // Kalau ada masalah lainnya
      error(res, 500, 'Internal Server Error', err.message, {})
    }
  },
}