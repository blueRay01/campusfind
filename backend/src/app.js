const express = require('express')
const cors = require('cors')

const app = express()

//middleware
app.use(cors())
app.use(express.json())

//routes
app.get('/health', (req, res) => {
    res.json({ status: 'ok'})
})

module.exports = app