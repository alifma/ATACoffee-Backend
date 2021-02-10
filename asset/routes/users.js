const {login ,register, detailUsers, updateUsers,getAllUsers,deleteUsers,updatePatchUsers} = require ('../controllers/users')
const express = require ('express')
const upload = require ('../helpers/middleware/multer')
const {getAllIUsersRedis } = require ('../helpers/redis/users')
const {authToken, authAdmin} = require('../helpers/middleware/auth')
const Router = express.Router()

Router
.post('/login', login)
.post('/register', register)
.get('/users/:id', authToken, detailUsers)
.put('/users/:id', authToken, upload, updateUsers)
.get('/users', authToken, authAdmin,getAllIUsersRedis, getAllUsers)
.delete('/users/:id', authToken,authAdmin, deleteUsers )
.patch('/users/:id', upload,updatePatchUsers)

module.exports =Router