const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/auth')
const authMiddleWare = require('./middleware/auth')
const postRoutes = require('./routes/posts')
const claimRoutes = require('./routes/claims')

const app = express()

//middleware
app.use(cors())
app.use(express.json())
app.use('/auth', authRoutes)
app.use('/posts', postRoutes)
app.use('/claims', claimRoutes)

//routes
app.get('/health', (req, res) => {
    res.json({ status: 'ok'})
})


module.exports = app