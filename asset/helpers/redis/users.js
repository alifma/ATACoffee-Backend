const client = require('../../config/redis')
const _ = require('lodash')
const {success} = require('../response')

module.exports = {
    getAllIUsersRedis: (req, res, next) => {
        client.get('users', (err, result) => {
            if (err) {
                console.log(err)
            } else {
                if (result) {
                    const chageJSON = JSON.parse(result)
                    const name = req.query.name ? req.query.name : '';
                    const sort = req.query.sort ? req.query.sort : 'id';
                    const order = req.query.order ? req.query.order : 'asc';
                    const limit = req.query.limit ? req.query.limit : 6;
                    const page = req.query.page ? req.query.page : 1;
                    const limitpage = page === 1 ? 0 : (page - 1) * limit
                    const filterData = _.filter(chageJSON, (items) => {
                        return items.name.includes(name)
                    })
                    const sortBy = _.orderBy(filterData, [sort], [order]);
                    console.log(sortBy)
                    const paginationData = _.slice(sortBy, limitpage, limitpage + limit)
                    const pagination = {
                        page: page,
                        limit: limit,
                        totalAll: chageJSON.length,
                        totalPage: Math.ceil(chageJSON.length / limit)
                    }
                    success(res, 200, 'Display From Redis Users Success', pagination, paginationData)
                } else {
                    next()
                }
            }
        })
    }
}