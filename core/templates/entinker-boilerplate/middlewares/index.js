const { v4: uuid } = require('uuid');
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')

function config(app) {
    app.use(express.static('public'))
    app.set('view engine', 'ejs')
    app.use(morgan('tiny'))

    // cors
    app.use(cors({
        origin: function (origin, callback) {
            callback(null, true)
        },
        credentials: true
    }))
    // body parser
    app.use(bodyParser.urlencoded({
        extended: true
    }))
    app.use(bodyParser.json())
    // unique requestId
    app.use((req, res, next) => {
        req.requestId = uuid()
        next()
    })

    //set has file boolean
    app.use((req,res, next) => {
        req.hasFile = Boolean(req.is('multipart/form-data'))
        next()
    })
}


module.exports = {config}