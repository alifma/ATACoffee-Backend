// Panggil koneksi database
const connection = require('../config/database')

// Export setiap methodnya
module.exports = {
  // Set Items ke Redis
  modelRedisItems: () => {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM items`, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  // Tampilkan Semua Items
  modelAllItems: (name, offset, limit, orderby, sort, category) => {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT items.id, items.name as name, categories.name as category, items.price, items.image, items.description, items.size, items.deliveryMethod, 
        items.stock, items.categoryID, items.hourStart, items.hourEnd, items.created_at FROM items LEFT JOIN categories ON items.categoryID = categories.id WHERE items.name LIKE '%${name}%' AND categoryID LIKE '${category}' ORDER BY items.${orderby}  ${sort} LIMIT ${offset}, ${limit}`, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  // Tampilkan Detail Items
  modelDetailItems: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT items.id, items.name as name, categories.name as category,
        items.price, items.image, items.description, items.size, items.deliveryMethod, 
        items.stock, items.categoryID, items.hourStart, items.hourEnd, items.created_at
        FROM items LEFT JOIN categories ON items.categoryID = categories.id WHERE items.id=${id}`, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  // Tambah Items Baru
  modelAddItems: (data) => {
    return new Promise((resolve, reject) => {
      connection.query(`INSERT INTO items (name, image, price, description, size, deliveryMethod, stock, categoryID, hourStart, hourEnd)
      VALUES ("${data.name}", '${data.image}', '${data.price}', '${data.description}', '${data.size}', '${data.deliveryMethod}', '${data.stock}', '${data.categoryID}', ${data.hourStart}, ${data.hourEnd})`, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  // Delete Items
  modelDeleteItems: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(`DELETE FROM items WHERE id='${id}'`, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  // Patch Items
  modelPatchItems: (data, id) => {
    return new Promise((resolve, reject) => {
      connection.query(`UPDATE items SET ? WHERE id=?`, [data, id],
        (error, result) => {
          if (error) {
            reject(new Error(error))
          } else {
            resolve(result)
          }
        })
    })
  },
  // Total Items
  modelTotalItems: () => {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT COUNT(id) as total FROM items`,
        (error, result) => {
          if (error) {
            reject(new Error(error))
          } else {
            resolve(result)
          }
        })
    })
  },
  // Total Items Sesuai Query
  modelResultItems: (name) => {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT COUNT(id) as total FROM items WHERE name LIKE '%${name}%'`,
        (error, result) => {
          if (error) {
            reject(new Error(error))
          } else {
            resolve(result)
          }
        })
    })
  }
}