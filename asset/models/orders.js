// Panggil koneksi database
const connection = require('../config/database')

// Eksport Semua Method
module.exports = {
  // Lempar Data Orders ke Redis
  modelRedisOrder: () => {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT (orderHead.inv) AS inv, orderHead.created_at, orderHead.cashierName as cashier, orderBody.userID, orderHead.userName as customer
      , GROUP_CONCAT(' ',orderBody.itemName,' (',orderBody.size,') x ',orderBody.amount) as orders , orderHead.total as total, orderHead.orderType, orderHead.orderDetails, orderHead.orderPhone, orderHead.paymentType, orderHead.isPending, orderHead.created_at, orderHead.updated_at 
      FROM orderHead LEFT JOIN orderBody ON orderHead.inv = orderBody.inv GROUP BY orderHead.inv`, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },

  modelAllOrder: (offset, limit, sort, range, user, pending) => {
    return new Promise((resolve, reject) => {
      let sql = `SELECT MIN(orderHead.inv) AS inv, orderHead.created_at, orderHead.cashierName as cashier, orderHead.userName as customer
        , GROUP_CONCAT(' ',orderBody.itemName,' (',orderBody.size,') x ',orderBody.amount) as orders , orderHead.total as total, orderHead.orderType, orderHead.orderDetails, orderHead.orderPhone, orderHead.paymentType, orderHead.isPending, orderHead.created_at, orderHead.updated_at 
        FROM orderHead LEFT JOIN orderBody ON orderHead.inv = orderBody.inv WHERE orderBody.isPending LIKE '${pending}' AND userID LIKE '${user}' AND `
      if (range == 'DAY' || range == 'day') {
        sql = sql + ` CAST(orderHead.created_at AS DATE) = CURDATE() GROUP BY orderHead.inv ORDER BY orderHead.created_at ${sort} LIMIT ${offset}, ${limit}`
      } else {
        sql = sql + ` orderHead.created_at BETWEEN date_sub(now(),INTERVAL 1 ${range}) and now() 
                  GROUP BY orderHead.inv ORDER BY orderHead.created_at ${sort} LIMIT ${offset}, ${limit}`
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
  modelDetailHead: (inv) => {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT inv, cashierName as cashier, userName as customer, orderType, orderDetails, orderPhone, paymentType, total, isPending, created_at, updated_at from orderHead WHERE inv = ${inv}`, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  modelDetailOrder: (inv) => {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT id, itemName as item, itemImage as image, size, amount, price FROM orderBody where inv = ${inv}`, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },

  // Tambahkan Order Baru
  modelPostBodyOrder: (data) => {
    return new Promise((resolve, reject) => {
      let sql = data.map(item => `('${item.inv}', '${item.userID}', '${item.userName}', '${item.itemName}', '${item.itemImage}', '${item.size}', ${item.amount}, ${item.price})`)
      connection.query(`INSERT INTO orderBody (inv, userID, userName, itemName, itemImage, size, amount, price) VALUES ${sql}`,
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
      connection.query(`INSERT INTO orderHead (inv, userName, orderType, orderDetails, orderPhone, paymentType, total)
      VALUE (${data.inv}, '${data.userName}', '${data.orderType}', '${data.orderDetails}', '${data.orderPhone}', '${data.paymentType}', ${data.total})`,
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
  // Banyaknya Order yang Terjadi
  modelTotalItems: (range, pending, user) => {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT COUNT(DISTINCT orderHead.inv) as total FROM orderHead LEFT JOIN orderBody ON orderHead.inv = orderBody.inv WHERE orderHead.isPending LIKE '${pending}' AND  orderBody.userID LIKE '${user}' AND orderBody.created_at BETWEEN date_sub(now(),INTERVAL 1 ${range}) and now()`,
        (error, result) => {
          if (error) {
            reject(new Error(error))
          } else {
            resolve(result)
          }
        })
    })
  },

  // Banyak Items yang sesuai
  // Banyaknya Order yang Terjadi
  modelTotalOrders: (range, pending) => {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT COUNT(inv) as total FROM orderHead WHERE isPending LIKE '${pending}' AND created_at BETWEEN date_sub(now(),INTERVAL 1 ${range}) and now()`,
        (error, result) => {
          if (error) {
            reject(new Error(error))
          } else {
            resolve(result)
          }
        })
    })
  },

  // Total Pemasukan dari Awal
  modelTotalIncome: () => {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT sum(total) as totalIncome FROM orderHead WHERE isPending = 0`,
        (error, result) => {
          if (error) {
            reject(new Error(error))
          } else {
            resolve(result)
          }
        })
    })
  },

  // Total Pemasukan Sesuai Range
  modelTotalRange: (range) => {
    return new Promise((resolve, reject) => {
      let sql = ''
      if (range == 'DAY' || 'day') {
        sql = `SELECT SUM(total) as totalIncome FROM orderHead WHERE CAST(created_at AS DATE) = CURDATE() AND isPending LIKE '0'`
      } else {
        sql = `SELECT sum(total) as totalIncome FROM orderHead WHERE isPending LIKE '0' AND created_at BETWEEN date_sub(now(),INTERVAL 1 ${range}) and now()`
      }
      connection.query(sql,
        (error, result) => {
          if (error) {
            reject(new Error(error))
          } else {
            resolve(result)
          }
        })
    })
  },

  // Yesterday Income
  modelTotalYesterday: () => {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT sum(total) as yesterdayIncome FROM orderHead WHERE isPending LIKE '0' AND DATE(created_at) < CURDATE() && DATE(created_at) > CURRENT_DATE - 2`,
        (error, result) => {
          if (error) {
            reject(new Error(error))
          } else {
            resolve(result)
          }
        })
    })
  },

  // Banyaknya Order yang Terjadi Minggu Kemarin
  modelTotalLastWeek: () => {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT COUNT(DISTINCT inv) as total FROM orderHead WHERE isPending LIKE '0' AND DATE(created_at) < CURDATE()-7 && DATE(created_at) > CURRENT_DATE - 14`,
        (error, result) => {
          if (error) {
            reject(new Error(error))
          } else {
            resolve(result)
          }
        })
    })
  },
}