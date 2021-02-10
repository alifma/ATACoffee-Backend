const jwt = require('jsonwebtoken')
const {JWT} = require('../env')
const {error} = require('../response')


module.exports ={
    authToken : (req,res,next) => {
        const headers = req.headers
        if(!headers.token){
            error(res, 400,'token must be required')
        }else{
            jwt.verify(headers.token, JWT, (err, decoded) =>{
                if(err){
                    error(res, 400,'token fail')
                }else{
                    res.userAccess = decoded.access
                    next()
                }
            })
        }
    },
    authAdmin : (req,res,next) => {
        const access = res.userAccess
        if(access === 1){
        next()
        }else{
            error(res, 400,'you are not allowed')
        }
    },
    authCostumer : (req,res,next) => {
        const access = res.userAccess
        if(access === 2) {
            next()
        }else{
            error(res, 400,'you are not allowed')
        }
        
    }
}