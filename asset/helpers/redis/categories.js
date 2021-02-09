// Redis Client
const client = require('../../config/redis')

// Response Helper 
const {
  success
} = require('../../helpers/response')

// Lodash
var _ = require('lodash');

module.exports = {
  getRedisCtgry: (req, res, next) => {
    client.get('dataCtgry', (err, result) => {
      if (err) {
        // Kalau ada gangguan pas getData
        console.log(err)
      } else {
        if (result) {
          // Ambil data Response
          const response = JSON.parse(result)
          // Ambil Parameter Yang dibutuhkan
          const deleteStatus = req.query.ready ? req.query.ready : 1
          // Filter data yang statusnya sesuai
          const dataFilterStatus = _.filter(response, (item) => {
            return item.isReady == deleteStatus
          })
          const pagination = {
            // Banyaknya item Yang sesuai filter
            total: dataFilterStatus.length
          }
          success(res, 200, 'Display Categories From Redis', pagination, dataFilterStatus)
        } else {
          next()
        }
      }
    })
  }
}