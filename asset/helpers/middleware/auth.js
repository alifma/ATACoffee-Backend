const { response } = require('express')
const jwt = require('jsonwebtoken')
const {JWT} = require('../env')
const {inputfail} = require('../sucerr')


module.exports ={
    authToken : (req,res,next) => {
        const headers = req.headers
        if(!headers.token){
            inputfail(res, 'token must be required')
        }else{
            jwt.verify(headers.token, JWT, (err, decoded) =>{
                if(err){
                    inputfail(res,'token fail')
                }else{
                    console.log(decoded)
                    res.userAccess = decoded.level
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
            inputfail(res,'you are not allowed')
        }
    },
    authCostumer : (req,res,next) => {
        const access = res.userAccess
        if(access === 2) {
            next()
        }else{
            inputfail(res,'you are not allowed')
        }
        
    }
}