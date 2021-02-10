// Model Categories
const {
    modelAllCtgry,
    modelTotalCtgry,
    modelDetailCtgry,
    modelAddCtgry,
    modelDeleteCtgry,
    modelUpdateCtgry,
    modelRedisCtgry
} = require('../models/categories')

// Redis Client
const redisClient = require('../config/redis');

// Response Helper 
const {
    error,
    success
} = require('../helpers/response')

// MomentJS
const moment = require('moment');

// Lodash
const {
    isUndefined
} = require('lodash');

module.exports = {
    // Lempar All categories ke Redist
    setRedisCtgry: () => {
        // Panggil Models All Active
        modelRedisCtgry().then((response) => {
            // Ubah Response jadi String agar bisa disimpan di redis
            const data = JSON.stringify(response)
            // Set Data ke RedisClient
            redisClient.set('dataCtgryATA', data)
        }).catch((err) => {
            // kalau ada Error
            error({}, 400, 'Internal Server Redis Error', err.message, {})
        })
    },

    // Tampilkan Semua Kategori
    getAllCtgry: async (req, res) => {
        try {
            // Ambil data dari query
            const deleteStatus = req.query.ready ? req.query.ready : 1
            // Ambil data dari Model dengan Await
            const totalCategory = await modelTotalCtgry(deleteStatus)
            modelAllCtgry(deleteStatus)
                .then((response) => {
                    // Kalau berhasil menambahkan kategori
                    if (response.length != 0) {
                        // Simpan Data ke Redis
                        module.exports.setRedisCtgry()
                        // Kalau data Ada Isinya
                        success(res, 200, 'Show All Category Success', totalCategory[0], response)
                    } else {
                        // Kalau tidak ada datanya
                        error(res, 400, 'No Data Found', '0 Result', {})
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

    // Tampilkan Detail Kategori
    getDetailCtgry: (req, res) => {
        try {
            const id = req.params.id
            modelDetailCtgry(id)
                .then((response) => {
                    if (response.length != 0) {
                        // Jika ada hasilnya
                        success(res, 200, 'Show Detail Category Success', {}, response)
                    } else {
                        // Jika tidak ada hasilnya
                        error(res, 400, 'Data Not Found, Wrong ID', '0 Result', {})
                    }
                })
                .catch((err) => {
                    // Kalau Ada salah di Query
                    error(res, 400, 'Wrong Parameter Type', err.message, {})
                })
        } catch (err) {
            // Kalau ada salah lainnya
            error(res, 500, 'Internal Server Error', err.message, {})
        }
    },

    // Tambah Kategori Baru
    addCtgry: (req, res) => {
        try {
            const data = req.body
            if (data.name) {
                modelAddCtgry(data)
                    .then(() => {
                        // Simpan Data ke Redis
                        module.exports.setRedisCtgry()
                        // Jika tambah data sukses
                        success(res, 200, 'Add Category Success', {}, {})
                    })
                    .catch((err) => {
                        // Kalau ada tipe data yang salah
                        error(res, 400, 'Wrong Data Type Given', err.message, {})
                    })
            } else {
                // Jika inputnya kosong
                error(res, 400, 'Please Fill All Field', 'Empty field found', {})
            }
        } catch (err) {
            // Kalau ada salah lainnya
            error(res, 500, 'Internal Server Error', err.message, {})
        }
    },
    // Delete Kategori
    deleteCtgry: (req, res) => {
        try {
            const id = req.params.id
            modelDeleteCtgry(id)
                .then((response) => {
                    if (response.affectedRows != 0) {
                        // Simpan Data ke Redis
                        module.exports.setRedisCtgry()
                        // Kalau hasilnya bukan array kosong
                        success(res, 200, 'Delete Category Success', {}, {})
                    } else {
                        // Kalau hasilnya array kosong
                        error(res, 400, 'Nothing Deleted, Wrong ID', '0 Result', {})
                    }
                })
                .catch((err) => {
                    // Kalau Ada salah di Query
                    error(res, 400, 'Wrong Parameter Type', err.message, {})
                })
        } catch (err) {
            // Kalau ada salah lainnya
            error(res, 500, 'Internal Server Error', err.message, {})
        }
    },
    // Perbarui Kategori
    updateCtgry: (req, res) => {
        try {
            const currDate = moment().format('YYYY-MM-DDThh:mm:ss.ms');
            const id = req.params.id
            const data = {
                ...req.body,
                'updated_at': currDate
            }
            if (data.length != 0) {
                modelUpdateCtgry(data, id)
                    .then((response) => {
                        if (response.affectedRows != 0) {
                            // Simpan Data ke Redis
                            module.exports.setRedisCtgry()
                            // Jika ada data terupdate
                            success(res, 200, 'Update Category Success', {}, {})
                        } else {
                            // Jikka tidak ada yang terupdate
                            error(res, 400, 'Nothing Updated, Wrong ID', {}, {})
                        }
                    })
                    .catch((err) => {
                        // Kalau ada tipe data yang salah
                        error(res, 400, 'Wrong Data Type Given', err.message, {})
                    })
            } else {
                // Jika inputnya kosong
                error(res, 400, 'Pleaas fill all Field', 'Empty field found', {})
            }
        } catch (err) {
            // Kalau ada salah lainnya
            error(res, 500, 'Internal Server Error', err.message, {})
        }
    }
}
