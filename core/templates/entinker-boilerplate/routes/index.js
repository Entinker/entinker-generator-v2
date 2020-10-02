const router = require('express').Router()

const api = require('./api')

router.get('/', (req,res) => {

    // res.status(500).end()
    res.json({ok:200})
})

router.use('/api/v1', api)


module.exports = router