require('dotenv').config()

const app = require('./app')

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Listening on ${PORT} - ${process.env.NODE_ENV} mode`)
})