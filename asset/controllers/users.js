const bycrypt = require('bcrypt')
const { register, checkEmail, modelsDetailUsers, modelsUpdateUsers, modelsGetTotalUsers, modelsGetAllUsers, modelsDeleteUsers, modelsGetAllUsersRedis } = require('../models/users')
const { emailRegister, datainvalid, success, fail } = require('../helpers/sucerr')
const fs = require('fs')
const { JWT } = require('../helpers/env')
const jwt = require('jsonwebtoken')
const { response } = require('express')
const redis = require('../config/redis')

module.exports = {
    login: async (req, res) => {
        const body = req.body
        checkEmail(body.email).then(async (response) => {
            if (response.length === 1) {
                const checkPassword = await bycrypt.compare(body.password, response[0].password)
                if (checkPassword === true) {
                    const user = {
                        id: response[0].id,
                        email: response[0].email,
                        access: response[0].access
                    }
                    const token = jwt.sign(user, JWT)
                    res.json({
                        msg: 'login success',
                        token: token
                    })

                    //    success(res, {}, {}, 'login success')
                } else {
                    datainvalid(res, 'password wrong')
                }
            } else {
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
                    username: body.username,
                    firstname: body.firstname,
                    lastname: body.lastname,
                    handphone: body.handphone,
                    access: body.access
                }
                module.exports.setRedisUsers()
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

    },
    detailUsers: (req, res) => {
        try {
            const id = req.params.id
            modelsDetailUsers(id)
                .then((response) => {
                    console.log(response)
                    const result = {
                        name: response[0].name,
                        username: response[0].username,
                        firstname: response[0].firstname,
                        lastname: response[0].lastname,
                        handphone: response[0].handphone,
                        gender: response[0].gender,
                        lahir: response[0].lahir,
                        image: response[0].image,
                        email: response[0].email,
                        address: response[0].address
                    }
                    success(res, result, {}, 'get detail success')
                })
                .catch((res) => {
                    datainvalid(res, 'cek data invalid')
                })
        } catch (error) {
            fail(res, 'server cant get what   you want', [])
        }
    },
    updateUsers: (req, res) => {
        const id = req.params.id;
        modelsDetailUsers(id)
        .then((response) => {
          console.log(response)
          const result = {
            image: response[0].image
          }
          fs.unlink('./public/image/' + result.image , (err) => {
            if (err) {
              console.error(err)
              return
            }
          })
        })
        .catch((res) => {
          fail(res, 'server cant get what you want', [])
        })
        try {
            const id = req.params.id
            const data = req.body
            console.log(data)
            const dataUpdate = {
                name: data.name,
                username: data.username,
                firstname: data.firstname,
                lastname: data.lastname,
                handphone: data.handphone,
                gender: data.gender,
                address: data.address,
                lahir: data.lahir,
                image: req.file.filename
            }
            console.log(dataUpdate)
            modelsUpdateUsers(dataUpdate, id)
                .then((response) => {
                    // module.exports.setRedisItems()
                    console.log(response)
                    module.exports.setRedisUsers()
                    success(res, dataUpdate, {}, 'update data success')
                })
                .catch((err) => {
                    fail(res, 'server cant update', dataUpdate)
                });

        } catch (error) {
            console.log(error)
            fail(res, 'server cant update', [])
        }
    },
    getAllUsers: async (req, res) => {
        try {
            const name = req.query.name ? req.query.name : '';
            const sort = req.query.sort ? req.query.sort : 'id';
            const order = req.query.order ? req.query.order : 'ASC';
            const limit = req.query.limit ? req.query.limit : 6;
            const page = req.query.page ? req.query.page : 1;
            const limitpage = page === 1 ? 0 : (page - 1) * limit
            const total = await modelsGetTotalUsers()
            modelsGetAllUsers(name, sort, order, limitpage, limit)
                .then((response) => {
                    console.log(response)
                    const data = []
                    response.forEach(element => {
                        data.push({
                            name: element.name,
                            username: element.username,
                            firstname: element.firstname,
                            lastname: element.lastname,
                            handphone: element.handphone,
                            gender: element.gender,
                            lahir: element.lahir,
                            image: element.image,
                            email: element.email,
                            address: element.address
                        })
                    })
                    console.log(data)
                    if (data.length < 1) {
                        datainvalid(res, 'data invalid', data)
                    } else {
                        const result = {
                            msg: 'data from database mysql',
                            page: page,
                            limit: limit,
                            totalAll: total[0].total,
                            totalPage: Math.ceil(total[0].total / limit)

                        }
                        module.exports.setRedisUsers()
                        success(res, data, result, 'get Product success')
                    }
                })
                .catch((err) => {
                    fail(res, 'server cant get what you want', err)
                })
        } catch (error) {
            fail(res, 'server cant get what   you want', [])
        }
    },
    deleteUsers: (req, res) => {
        const id = req.params.id;
        modelsDetailUsers(id)
        .then((response) => {
          console.log(response)
          const result = {
            image: response[0].image
          }
          fs.unlink('./public/image/' + result.image , (err) => {
            if (err) {
              console.error(err)
              return
            }
          })
        })
        .catch((res) => {
          fail(res, 'server cant get what you want', [])
        })
        try {
            const id = req.params.id
            modelsDeleteUsers(id)
                .then((response) => {
                    module.exports.setRedisUsers()
                    success(res, {}, {}, 'delete data success')
                })
                .catch((err) => {
                    console.log(err)
                })
        } catch (err) {
            console.log(err)
        }
    },
    setRedisUsers: () => {
        modelsGetAllUsersRedis().then((response) => {
          const data =JSON.stringify(response)
          redis.set('users',data)
        }).catch((err) => {
          console.log(err)
        })
      }
}