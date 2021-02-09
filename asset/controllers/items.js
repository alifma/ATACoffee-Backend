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

// Remove File Operation
const fs = require('fs')

// Response Helper 
const {
  error,
  success
} = require('../helpers/response')

// MomentJS
const moment = require('moment');

const { isUndefined } = require('lodash');

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
            // module.exports.setRedisMenus()
            // Kalau arraynya ada isinya
            success(res, 200, 'Display Items Success', pagination, arr)
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

  // Tampilkan detail dari sebuah menu
  getDetailItems: (req, res) => {
    try {
        // Ambil params, params itu yang ada di link
        const id = req.params.id
        modelDetailItems(id)
            .then((response) => {
                if (response.length != 0) {
                    // Kalau responsenya gak kosong
                    success(res, 200, 'Display Detail Items Success', {}, response)
                } else {
                    // Kalau responsenya kosong
                    error(res, 400, 'Data Not Found, Wrong ID', '0 Result', {})
                }
            })
            .catch((err) => {
                // Kalau Tipe ID Salah 
                error(res, 400, 'Wrong Parameter Type Given', err.message, {})
            })
    } catch (err) {
        // Kalau ada masalah lainnya
        error(res, 500, 'Internal Server Error', err.message, {})
    }
  },

  // Tambahkan Menu baru
  addItems: (req, res) => {
    try {
        const rawData = req.body
        if ( rawData.name &&  rawData.price && rawData.description && rawData.size && rawData.deliveryMethod && rawData.stock && rawData.categoryID && !isUndefined(req.file) ) {
          const data = {
                name: rawData.name,
                image: req.file.filename,
                price: rawData.price,
                description: rawData.description,
                size: rawData.size,
                deliveryMethod: rawData.deliveryMethod,
                stock: rawData.stock,
                categoryID: rawData.categoryID,
                hourStart: rawData.hourStart == '' ? null : `'${rawData.hourStart}'`,
                hourEnd: rawData.hourEnd == '' ? null : `'${rawData.hourEnd}'`
            }
            console.log(data)
            modelAddItems(data)
                .then(() => {
                    // Set data ke Redis
                    // module.exports.setRedisMenus()
                    // Kalau berhasil menambahkan data
                    success(res, 200, 'Add Menu Success', {}, {})
                })
                .catch((err) => {
                    // Hapus File yang terupload keupload kalau gak jadi
                    if(req.file){
                        fs.unlinkSync(`./public/image/${req.file.filename}`)
                    }
                    // Kalau tipe data ada yang salah
                    error(res, 400, 'Wrong Data Type Given', err.message, {})
                })
        } else {
            // Hapus File yang terupload keupload kalau gak jadi
            if(req.file){
                fs.unlinkSync(`./public/image/${req.file.filename}`)
            }
            // Kalau ada data yang kosong
            error(res, 400, 'Please fill all field!', 'Empty field found', {})
        }
    } catch (err) {
        // Hapus File yang terupload keupload kalau gak jadi
        if(req.file){
            fs.unlinkSync(`./public/image/${req.file.filename}`)
        }
        // Kalau ada masalah lainnya
        error(res, 500, 'Internal Server Error', err.message, {})
    }
  },

  // Delete Menu
  deleteItems: (req, res) => {
    try {
        const id = req.params.id
        // Delete File
        modelDetailItems(id)
            .then((res)=> {
                fs.unlinkSync(`./public/image/${res[0].image}`)
            })
            .catch((err)=>{console.log(err)})
        modelDeleteItems(id)
            .then((response) => {
                if (response.affectedRows != 0) {
                    // Set data ke Redis
                    // module.exports.setRedisMenus()
                    // Kalau ada yang terhapus
                    success(res, 200, 'Delete Menu Success', {}, {})
                } else {
                    // Kalau tidak ada  yang terhapus karena salah ID
                    error(res, 400, 'Nothing deleted, Wrong ID!', {}, {})
                }
            })
            .catch((err) => {
                // Kalau Tipe ID Salah 
                error(res, 400, 'Wrong Parameter Type Given', err.message, {})
            })
    } catch (err) {
        // Kalau ada masalah lainnya
        error(res, 500, 'Internal Server Error', err.message, {})
    }
  },

  // Perbarui Menu (Beberapa Kolom)
  patchItems: (req, res) => {
    try {
        const id = req.params.id
        const currDate = moment().format('YYYY-MM-DDThh:mm:ss.ms');
        const rawData = req.body
        if(rawData.name ||  rawData.price || rawData.description || rawData.size || rawData.deliveryMethod || rawData.stock || rawData.categoryID || !isUndefined(req.file) ){
            // Hapus Gambar jika gambarnya tidak kosong
            let data = {}
            if(!isUndefined(req.file)) {
                data = {
                    ...rawData,
                    image: req.file.filename,
                    'updated_at': currDate
                }
                modelDetailItems(id)
                    .then((res)=> {
                        fs.unlinkSync(`./public/image/${res[0].image}`)
                    })
                    .catch((err)=>{console.log(err)})
            }else{
                data = {
                    ...rawData,
                    'updated_at': currDate
                } 
            }
            // Update Data Menus
            modelPatchItems(data, id)
                .then((response) => {
                    if (response.affectedRows != 0) {
                        // Set data ke Redis
                        // module.exports.setRedisMenus()
                        // Kalau ada data yang terupdate
                        success(res, 200, 'Patch Item Success', {}, {})
                    } else {
                        // Hapus File yang terupload keupload kalau gak jadi
                        if(req.file){
                            fs.unlinkSync(`./public/image/${req.file.filename}`)
                        }
                        // Kalau tidak ada data yang berubah
                        error(res, 400, 'Nothing Patched, Wrong ID', '0 Result', {})
                    }
                })
                .catch((err) => {
                    // Hapus File yang terupload keupload kalau gak jadi
                    if(req.file){
                        fs.unlinkSync(`./public/image/${req.file.filename}`)
                    }
                    // Kalau tipe data ada yang salah
                    error(res, 400, 'Wrong Data Type Given', err.message, {})
                })
        }else{
            // Kalau tidak ada data yang dimasukkan 
            error(res, 400, 'Nothing Patched, No Data Given', 'Empty Data', {})
        }
    } catch (err) {
        // Hapus File yang Tadi keupload kalau gak jadi
        if(req.file){
            fs.unlinkSync(`./public/image/${req.file.filename}`)
        }
        // Kalau ada masalah lainnya
        error(res, 500, 'Internal Server Error', err.message, {})
    }
  }
}