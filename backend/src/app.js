const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/auth')
const authMiddleWare = require('./middleware/auth')

const app = express()

//middleware
app.use(cors())
app.use(express.json())
app.use('/auth', authRoutes)

//routes
app.get('/health', (req, res) => {
    res.json({ status: 'ok'})
})

app.get('/protected', authMiddleWare, (req, res) => {
    res.json({ message: "You are now logged in", user: req.user})
})

module.exports = app