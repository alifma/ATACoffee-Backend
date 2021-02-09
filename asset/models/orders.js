// Panggil koneksi database
const connection = require('../config/database')

// Eksport Semua Method
module.exports = {
  // Tambahkan Order Baru
  modelPostBodyOrder: (data) => {
    return new Promise((resolve, reject) => {
      let sql = data.map(item => `('${item.inv}', '${item.userID}', '${item.userName}', '${item.itemName}', '${item.size}', ${item.amount}, ${item.price})`)
      connection.query(`INSERT INTO orderBody (inv, userID, userName, itemName, size, amount, price) VALUES ${sql}`,
        (error, result) => {
          if (error) {
            reject(new Error(error))
          } else {
            resolve(result)
          }
        })
    })
  },

  // Tambahkan Head Order Baru
  modelPostHeadOrder: (data) => {
    return new Promise((resolve, reject) => {
      connection.query(`INSERT INTO orderHead (inv, cashierID, userID, userName, orderType, orderDetails, orderPhone, paymentType, total)
      VALUE (${data.inv}, ${data.cashierID}, ${data.userID}, '${data.userName}', '${data.orderType}', '${data.orderDetails}', '${data.orderPhone}', '${data.paymentType}', ${data.total})`,
        (error, result) => {
          if (error) {
            reject(new Error(error))
          } else {
            resolve(result)
          }
        })
    })
  },

  modelUpdateHeadOrder: (data, inv) => {
    return new Promise((resolve, reject) => {
      connection.query(`UPDATE orderHead SET ? WHERE inv=?`, [data, inv],
        (error, result) => {
          if (error) {
            reject(new Error(error))
          } else {
            resolve(result)
          }
        })
    })
  },

  modelUpdateBodyOrder: (data, inv) => {
    return new Promise((resolve, reject) => {
      connection.query(`UPDATE orderBody SET ? WHERE inv=?`, [data, inv],
        (error, result) => {
          if (error) {
            reject(new Error(error))
          } else {
            resolve(result)
          }
        })
    })
  },

  // Hapus Order Berdasarkan Invoice
  modelDeleteOrder: (inv) => {
    return new Promise((resolve, reject) => {
        connection.query(`DELETE orderBody, orderHead FROM orderHead INNER JOIN orderBody 
        WHERE orderBody.inv=${inv} AND orderHead.inv=${inv}`, (error, result) => {
            if (error) {
                reject(new Error(error))
            } else {
                resolve(result)
            }
        })
    })
  },
}