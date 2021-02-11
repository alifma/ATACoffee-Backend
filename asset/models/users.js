const {
  result
} = require('lodash')
const connection = require('../config/database')

module.exports = {
  login: () => {
    return
  },
  checkEmail: (email) => {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM users WHERE email='${email}'`, (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  },
  register: (dataUser) => {
    return new Promise((resolve, reject) => {
      connection.query(`INSERT into users set ?`, dataUser, (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  },
  modelsUpdateUsers: (dataUpdate, id) => {
    return new Promise((resolve, reject) => {
      connection.query(`UPDATE users SET name='${dataUpdate.name}', username='${dataUpdate.username}', firstname='${dataUpdate.firstname}',
            lastname='${dataUpdate.lastname}', handphone='${dataUpdate.handphone}', gender='${dataUpdate.gender}', address='${dataUpdate.address}', lahir='${dataUpdate.lahir}', image='${dataUpdate.image}', password='${dataUpdate.password}'
            WHERE id='${id}'`,
        (err, result) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(result)
          }
        })
    })
  },
  modelsUpdatePatchUsers: (data, id) => {
    return new Promise((resolve, reject) => {
      connection.query(`UPDATE users SET ? WHERE id=?`, [data, id],
        (error, result) => {
          if (error) {
            reject(new Error(error))
          } else {
            resolve(result)
          }
        })
    })
  },
  modelsDetailUsers: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT name,username,firstname,lastname,handphone,gender,lahir,image,email,address FROM users WHERE id=${id}`,
        (err, result) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(result)
          }
        })
    })
  },
  modelsGetAllUsers: (name, sort, order, limitpage, limit) => {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT name,username,firstname,lastname,handphone,gender,lahir,image,email,address FROM users
          WHERE name LIKE '%${name}%'  ORDER BY ${sort} ${order} LIMIT ${limitpage},${limit} `,
        (err, result) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(result)
          }
        })
    })
  },
  modelsGetTotalUsers: () => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT COUNT(*) as total FROM users`,
        (err, result) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(result)
          }
        }
      )
    })
  },
  modelsDeleteUsers: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(`DELETE FROM users WHERE id='${id}'`, (err, result) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(result)
        }
      })
    })
  },
  modelsGetAllUsersRedis: () => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT name,username,firstname,lastname,handphone,gender,lahir,image,email,address FROM users`,
        (err, result) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(result)
          }
        }
      )
    })
  }
}