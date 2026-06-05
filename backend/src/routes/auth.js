const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const pool = require('../config')

router.post('/register', async(req, res) => {
    const saltRounds = 10;

    try {
    const { name, student_id, email, password } = req.body;
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if (existingUser.rows.length > 0) {
        return res.status(400).json({ message: 'Email already registered' })
    }

    const hash = await bcrypt.hash(password, saltRounds)

    await pool.query('INSERT INTO users (name, student_id, email, hash) VALUES ($1, $2, $3, $4) RETURNING id, name, email', [name, student_id, email, password])

    res.status(201).json({ message: 'User registered successfully' })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
})

router.post('/login', (req, res) => {
  // login logic will go here
})

module.exports = router