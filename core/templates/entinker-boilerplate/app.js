const entinker = require('./entinker').registerGlobal() //adds `use` and `portal` to global namespace
const express = require('express')
const app = express()
const middlewares = require('./middlewares')
const services = require('./services')

services.init()
middlewares.config(app)

const routes = require('./routes')

app.use('/', routes)


app.use(async (error,req,res,next) => {
    let {
        status,
        body
    } = await errorResponse(error)

    return res.status(status).json({
        ...body
    })
})

module.exports = app