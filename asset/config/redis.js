const redis = require('redis')
const redisClient = redis.createClient()

redisClient.on('error', (error) =>{
    console.log(error)
})

module.exports = redisClient