const bycrypt = require('bcrypt')
const {
    register,
    checkEmail,
    modelsDetailUsers,
    modelsUpdateUsers,
    modelsGetTotalUsers,
    modelsGetAllUsers,
    modelsDeleteUsers,
    modelsGetAllUsersRedis
} = require('../models/users')
const {
    success,
    error
} = require('../helpers/response')
const fs = require('fs')
const {
    JWT
} = require('../helpers/env')
const jwt = require('jsonwebtoken')
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
                        msg: 'Login Success',
                        id: response[0].id,
                        name: response[0].name,
                        access: response[0].access,
                        token: token
                    })
                    success(res, 200, 'Login Success', {})
                } else {
                    error(res, 400, 'Wrong Password', 'Password Failed', {})
                }
            } else {
                error(res, 400, 'Email Not Registered', 'Email Failed', {})
            }
        }).catch((err) => {
            error(res, 500, 'Internal Server Error', err.message, {})
        })
    },

    register: async (req, res) => {
        const body = req.body
        console.log(body)
        checkEmail(body.email).then(async (response) => {
            if (response.length >= 1) {
                error(res, 400, 'Email Exist')
            } else {
                const salt = await bycrypt.genSalt()
                const password = await bycrypt.hash(body.password, salt)
                const user = {
                    email: body.email,
                    password,
                    name: body.email,
                    handphone: body.handphone,
                }
                module.exports.setRedisUsers()
                // res.json(user)
                register(user).then((response) => {
                    success(res, 200, 'Register Success', {}, {})
                }).catch((err) => {
                    error(res, 400, 'Input Problem', err.message, {})
                })
            }
        }).catch((err) => {
            error(res, 500, 'Internal Server Error', err.message, {})
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
                    success(res, 200, 'Display Items Success', {}, result)
                })
                .catch((err) => {
                    error(res, 400, 'Parameter Problem', err.message, {})
                })
        } catch (err) {
            error(res, 500, 'Internal Server Error', err.message, {})
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
                fs.unlink('./public/image/' + result.image, (err) => {
                    if (err) {
                        console.error(err)
                        return
                    }
                })
            })
            .catch((err) => {
                error(res, 400, 'Cant Delete User Image', err.message, {})
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
                    console.log(response)
                    module.exports.setRedisUsers()
                    success(res, 200, 'Update Data Users Success', {}, dataUpdate)
                })
                .catch((err) => {
                    error(res, 400, 'Server Cant Update', err.message, {})
                });
        } catch (err) {
            error(res, 500, 'Internal Server Error', err.message, {})
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
                        error(res, 400, 'data cant find')
                    } else {
                        const result = {
                            msg: 'data from database mysql',
                            page: page,
                            limit: limit,
                            totalAll: total[0].total,
                            totalPage: Math.ceil(total[0].total / limit)

                        }
                        module.exports.setRedisUsers()
                        success(res, 200, 'Get Users Success', result, data)
                    }
                })
                .catch((err) => {
                    error(res, 400, 'server cant get what you want', err.message)
                })
        } catch (err) {
            error(res, 400, 'server cant get what   you want', err.message)
        }
    },
    deleteUsers: async (req, res) => {
        try {
            const id = req.params.id;
            await modelsDetailUsers(id)
                .then((response) => {
                    if (response[0].image != 'default.png') {
                        fs.unlink('./public/image/' + response[0].image, (err) => {
                            if (err) {
                                console.error(err)
                                return
                            }
                        })
                    }
                })
                .catch((err) => {
                    error(res, 400, 'server cant get what you want', err.message)
                })
            modelsDeleteUsers(id)
                .then(() => {
                    module.exports.setRedisUsers()
                    success(res, 200, 'Delete Data Users Success', {}, {})
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
            const data = JSON.stringify(response)
            redis.set('users', data)
        }).catch((err) => {
            console.log(err)
        })
    }
}