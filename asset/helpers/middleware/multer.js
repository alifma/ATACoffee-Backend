const multer = require('multer')
const path = require('path')
const {error} = require('../response')

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
    limits: {fileSize:2},
    fileFilter: (req,file,cb) => {
        const fileext =path.extname(file.originalname)
        console.log(fileext)
        if(fileext === '.jpg' || fileext === '.png'|| fileext === '.PNG'|| fileext === '.JPG'){
            cb(null,true)   
        }else{
        cb({message: 'Error File Type'},false)
        }
    }
})

const upload = (req, res ,next) => {
    const sigleUpload =dataUpload.single('image')
    sigleUpload(req,res, (err) => {
        if (err) { 
            error(res, 400,'error file upload', {}, err.message)
        }else {
            next()
        }
    })
}

module.exports = upload