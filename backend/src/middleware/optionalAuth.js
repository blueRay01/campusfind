const jwt = require('jsonwebtoken')

const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return next()
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
    } catch{} {
    }

    next()
}

module.exports = optionalAuth