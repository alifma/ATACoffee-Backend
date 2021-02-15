const {login ,register, detailUsers, updateUsers,getAllUsers,deleteUsers,updatePatchUsers} = require ('../controllers/users')
const express = require ('express')
const upload = require ('../helpers/middleware/multer')
const {getAllIUsersRedis } = require ('../helpers/redis/users')
const {authToken, authAdmin} = require('../helpers/middleware/auth')
const Router = express.Router()

Router
.post('/api/login', login)
.post('/api/register', register)
.get('/api/users/:id', authToken, detailUsers)
.put('/api/users/:id', authToken, upload, updateUsers)
.get('/api/users', authToken, authAdmin,getAllIUsersRedis, getAllUsers)
.delete('/api/users/:id', authToken,authAdmin, deleteUsers )
.patch('/api/users/:id', authToken, upload, updatePatchUsers)

module.exports =Router