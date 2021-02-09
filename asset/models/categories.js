// Panggil koneksi database
const connection = require('../config/database')

// Export setiap methodnya
module.exports = {
    // Tangkap Semua Kategori untuk Redis
    modelRedisCtgry: () => {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * from categories`, (error, result) => {
                if (error) {
                    reject(new Error(error))
                } else {
                    resolve(result)
                }
            })
        })
    },
    // Tampilkan Semua Kategori
    modelAllCtgry: (status) => {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * from categories WHERE isReady = ${status}`, (error, result) => {
                if (error) {
                    reject(new Error(error))
                } else {
                    resolve(result)
                }
            })
        })
    },

    // Tampilkan Detail Kategori
    modelDetailCtgry: (id) => {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * from categories WHERE id = ${id}`, (error, result) => {
                if (error) {
                    reject(new Error(error))
                } else {
                    resolve(result)
                }
            })
        })
    },

    // Tambahkan Kategori Baru
    modelAddCtgry: (data) => {
        return new Promise((resolve, reject) => {
            connection.query(`INSERT INTO categories (name) VALUES ('${data.name}')`, (error, result) => {
                if (error) {
                    reject(new Error(error))
                } else {
                    resolve(result)
                }
            })
        })
    },

    // Hitung Semua Kategori
    modelTotalCtgry: (status) => {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT COUNT(id) as total FROM categories WHERE isReady LIKE '%${status}%'`,
                (error, result) => {
                    if (error) {
                        reject(new Error(error))
                    } else {
                        resolve(result)
                    }
                })
        })
    },

    // Delete Kategori
    modelDeleteCtgry: (id) => {
        return new Promise((resolve, reject) => {
            connection.query(`DELETE FROM categories WHERE id = ${id}`, (error, result) => {
                if (error) {
                    reject(new Error(error))
                } else {
                    resolve(result)
                }
            })
        })
    },

    // Perbarui Kategori
    modelUpdateCtgry: (data, id) => {
        return new Promise((resolve, reject) => {
            connection.query(`UPDATE categories SET ? WHERE id=?`, [data, id], (error, result) => {
                if (error) {
                    reject(new Error(error))
                } else {
                    resolve(result)
                }
            })
        })
    },
}