const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const pool = require('../config/db')
const jwt = require('jsonwebtoken')



router.post('/register', async(req, res) => {
    const saltRounds = 10;

    try {
    const { name, student_id, email, password, course } = req.body;
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if (existingUser.rows.length > 0) {
        return res.status(400).json({ message: 'Email already registered' })
    }

    const hash = await bcrypt.hash(password, saltRounds)

    await pool.query('INSERT INTO users (name, student_id, email, password, course) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email', [name, student_id, email, hash, course])

    res.status(201).json({ message: 'User registered successfully' })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
})

router.post('/login', async(req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email])
        if (existingUser.rows.length === 0) {
            return res.status(400).json({ message : "Account doesn't exist" })
        }

        const user = existingUser.rows[0]
        
        const match = await bcrypt.compare(password, user.password)

        if(match) {
            const token = jwt.sign(
                { id : user.id },
                process.env.JWT_SECRET,
                { expiresIn : '7d'}
            )

            res.status(200).json({token})
        } else {
            res.status(400).json({ message : "Incorrect password."})
        }


    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
})

module.exports = router