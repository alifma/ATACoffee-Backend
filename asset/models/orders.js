// Panggil koneksi database
const connection = require('../config/database')

// Eksport Semua Method
module.exports = {
  modelAllOrders: (offset, limit, sort, range, user) => {
    return new Promise((resolve, reject) => {
        let sql = ''
        if (range == 'DAY' || range == 'day') {
            sql = `SELECT MIN(orderHead.inv) AS inv, orderHead.created_at, orderHead.cashierID, GROUP_CONCAT(' ',orderBody.itemName,'(',orderBody.size,') x ',orderBody.amount) as orders , orderHead.total as total, orderHead.total * 0.1 as ppn
            FROM orderHead LEFT JOIN orderBody ON orderHead.inv = orderBody.inv WHERE CAST(orderHead.created_at AS DATE) = CURDATE() GROUP BY orderHead.inv ORDER BY orderHead.created_at ${sort} LIMIT ${offset}, ${limit}`
        }else{
            sql = `SELECT MIN(orderHead.inv) AS inv, orderHead.created_at, orderHead.cashier, GROUP_CONCAT(' ',orderBody.itemName,' x ',orderBody.amount) as orders , orderHead.total as total, orderHead.total * 0.1 as ppn
            FROM orderHead LEFT JOIN orderBody ON orderHead.inv = orderBody.inv WHERE orderHead.created_at BETWEEN date_sub(now(),INTERVAL 1 ${range}) and now() 
            GROUP BY orderBody_head.inv ORDER BY orderBody_head.created_at ${sort} LIMIT ${offset}, ${limit}`
        }
        connection.query(sql, (error, result) => {
                if (error) {
                    reject(new Error(error))
                } else {
                    resolve(result)
                }
            })
    })
  },

  // Tampilkan Detail order tiap invoices
  modelDetailOrder: (inv) => {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT inv, cashierID, userID, size, amount, price, orderType, orderDetails, orderPhone, paymentType FROM orders WHERE INV = ${inv}`, (error, result) => {
          if (error) {
              reject(new Error(error))
          } else {
              resolve(result)
          }
      })
    })
  },

   // Tambahkan Order Baru
  modelPostOrder: (data) => {	
    return new Promise((resolve, reject) => {
      let sql = data.map(item => `(${item.inv}, ${item.cashierID}, ${item.userID}, '${item.itemName}', '${item.size}', ${item.amount}, ${item.price}, '${item.orderType}', '${item.orderDetails}', '${item.orderPhone}', '${item.paymentType}')`)
      connection.query(`INSERT INTO orders (inv, cashierID, userID, itemName, size, amount, price, orderType, orderDetails, orderPhone, paymentType) VALUES ${sql}`,
        (error, result) => {
          if (error) {
            reject(new Error(error))
          } else {
            resolve(result)
          }
        })
    })
  },
  modelUpdateOrder: (data, inv) => {
    return new Promise((resolve, reject) => {
      connection.query(`UPDATE orders SET ? WHERE inv=?`, [data, inv],
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
        connection.query(`DELETE FROM orders WHERE inv=${inv}`, (error, result) => {
            if (error) {
                reject(new Error(error))
            } else {
                resolve(result)
            }
        })
    })
  },
}