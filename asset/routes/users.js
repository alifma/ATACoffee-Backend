const {login ,register, detailUsers, updateUsers,getAllUsers,deleteUsers} = require ('../controllers/users')
const express = require ('express')
const upload = require ('../helpers/middleware/multer')
const {getAllIUsersRedis } = require ('../helpers/redis/users')
const Router = express.Router()

Router
.post('/login', login)
.post('/register', register)
.get('/users/:id', detailUsers)
.put('/users/:id', upload, updateUsers)
.get('/users', getAllIUsersRedis, getAllUsers)
.delete('/users/:id', deleteUsers )

module.exports =Router