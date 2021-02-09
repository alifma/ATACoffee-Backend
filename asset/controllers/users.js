const bycrypt = require('bcrypt')
const { register, checkEmail } = require('../models/users')
const { emailRegister,datainvalid, success } = require('../helpers/sucerr')
const {JWT} = require('../helpers/env')
const jwt = require('jsonwebtoken')

module.exports = {
    login: async(req, res) => {
        const body = req.body
        checkEmail(body.email).then(async(response) => {
            if(response.length === 1){
               const checkPassword = await bycrypt.compare(body.password, response[0].password)
               if (checkPassword === true) {
                   const user ={
                       id : response[0].id,
                       email : response[0].email,
                       access : response[0].access
                   }
                   const token = jwt.sign(user, JWT )
                   res.json({
                       msg: 'login success',
                       token : token
                   })
                
                //    success(res, {}, {}, 'login success')
               }else{
                   datainvalid(res, 'password wrong')
               }
            }else{
                datainvalid(res, 'email unregister')
            }
        }).catch((error) => {
            res.json(error)
        })
    },
    register: async (req, res) => {

        const body = req.body
        console.log(body)
        checkEmail(body.email).then(async (response) => {
            if (response.length >= 1) {
                emailRegister(res, 'email already exist')
            } else {
                const salt = await bycrypt.genSalt()
                const password = await bycrypt.hash(body.password, salt)
                const user = {
                    email: body.email,
                    password,
                    name: body.name,
                    handphone: body.handphone,
                    access: body.access
                }
                // res.json(user)
                register(user).then((response) => {
                    success(res, 'data register')
                }).catch((error) => {
                    res.json(error)
                })
            }
        }).catch((error) => {
            console.log(error)
        })

    }
}