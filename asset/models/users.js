const connection = require('../config/database')

module.exports ={
    login: () => {
        return
    },
    checkEmail : (email) => {
        return new Promise ((resolve, reject) => {
            connection.query(`SELECT * FROM users WHERE email='${email}'` , (err, result) => {
                if(err) {
                    reject(err)
                }else{
                    resolve(result)
                }
            })
        })
    },
    register: (dataUser) => {
        return new Promise((resolve,reject) => {
            connection.query(`INSERT into users set ?`, dataUser, (err, result) =>{
                if(err) {
                    reject(err)
                }else{
                    resolve(result)
                }
            })
        })
    }
}