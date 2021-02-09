const multer = require('multer')
const path = require('path')
const {datainvalid} = require('../sucerr')

const multerStorage = multer.diskStorage({
    destination: (res,file,cb) => {
        cb(null , './public/image')
    },
    filename : (req, file , cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`)
    }
})

const dataUpload = multer({
    storage: multerStorage,
    limits: {fileSize:2000000},
    fileFilter: (req,file,cb) => {
        const fileext =path.extname(file.originalname)
        console.log(fileext)
        if(fileext === '.jpg' || fileext === '.png'|| fileext === '.PNG'|| fileext === '.JPG'){
            cb(null,true)   
        }else{
        cb('file must be .png or .jpg',false)
        }
    }
})

const upload = (req, res ,next) => {
    const sigleUpload =dataUpload.single('image')
    sigleUpload(req,res, (err) => {
        if (err) { 
            datainvalid(res, 'file max 2Mb', err)
        }else {
            next()
        }
    })
}

module.exports = upload