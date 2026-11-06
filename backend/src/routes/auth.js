const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const pool = require('../config/db')
const jwt = require('jsonwebtoken')
const authMiddleWare = require('../middleware/auth')

const SALT_ROUNDS = 10
const NAME_CHANGE_COOLDOWN_DAYS = 30
const MIN_PASSWORD_LENGTH = 8

router.get('/my', authMiddleWare, async (req, res) => {
    try {
        const id = req.user.id
        const user = await pool.query(
            `SELECT id, name, student_id, email, course, created_at, contact,
                    name_changed_at, password_changed_at
             FROM users WHERE id = $1`,
            [id]
        )

        if (user.rows.length === 0) {
            return res.status(404).json({ message: "No user found."})
        } else {
            res.status(200).json(user.rows[0])
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error.'})
    }

})

router.post('/register', async(req, res) => {
    try {
    const { name, email, password, student_id, course } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required.' })
    }

    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if (existingUser.rows.length > 0) {
        return res.status(400).json({ message: 'Email already registered' })
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS)

    await pool.query(
        'INSERT INTO users (name, email, password, student_id, course) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email',
        [name.trim(), email.trim(), hash, student_id?.trim() || null, course?.trim() || null]
    )

    res.status(201).json({ message: 'User registered successfully' })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error.' })
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

router.patch('/my', authMiddleWare, async(req, res) => {
    try {
        const id = req.user.id
        const { contact } = req.body
        let name = req.body.name

        const current = await pool.query('SELECT name, name_changed_at FROM users WHERE id = $1', [id])
        if (current.rows.length === 0) {
            return res.status(404).json({ message: "No user found."})
        }

        if (name !== undefined) {
            name = String(name).trim()
            if (name.length < 2) {
                return res.status(400).json({ message: "Name must be at least 2 characters." })
            }
            if (name === current.rows[0].name) {
                name = undefined // nothing changed
            } else if (current.rows[0].name_changed_at) {
                const daysPassed = Math.floor((Date.now() - new Date(current.rows[0].name_changed_at).getTime()) / 86400000)
                if (daysPassed < NAME_CHANGE_COOLDOWN_DAYS) {
                    const daysLeft = NAME_CHANGE_COOLDOWN_DAYS - daysPassed
                    return res.status(400).json({ message: `You can change your name again in ${daysLeft} days.` })
                }
            }
        }

        const user = await pool.query(
            `UPDATE users
             SET contact = COALESCE($1::text, contact),
                 name = COALESCE($2::text, name),
                 name_changed_at = CASE WHEN $2::text IS NOT NULL THEN NOW() ELSE name_changed_at END
             WHERE id = $3
             RETURNING name, contact, name_changed_at`,
            [contact === undefined ? null : contact, name === undefined ? null : name, id]
        )

        res.status(200).json(user.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error.'})
    }
})

router.patch('/password', authMiddleWare, async(req, res) => {
    try {
        const id = req.user.id
        const { current_password, new_password } = req.body

        if (!current_password || !new_password) {
            return res.status(400).json({ message: "Enter your current and new password." })
        }
        if (new_password.length < MIN_PASSWORD_LENGTH) {
            return res.status(400).json({ message: `New password must be at least ${MIN_PASSWORD_LENGTH} characters.` })
        }

        const user = await pool.query('SELECT password FROM users WHERE id = $1', [id])
        if (user.rows.length === 0) {
            return res.status(404).json({ message: "No user found." })
        }

        const match = await bcrypt.compare(current_password, user.rows[0].password)
        if (!match) {
            return res.status(400).json({ message: "Current password is incorrect." })
        }

        const hash = await bcrypt.hash(new_password, SALT_ROUNDS)
        const updated = await pool.query(
            'UPDATE users SET password = $1, password_changed_at = NOW() WHERE id = $2 RETURNING password_changed_at',
            [hash, id]
        )

        res.status(200).json({ message: "Password updated.", password_changed_at: updated.rows[0].password_changed_at })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error.' })
    }
})

router.delete('/my', authMiddleWare, async(req, res) => {
    const id = req.user.id
    const { password } = req.body || {}

    if (!password) {
        return res.status(400).json({ message: "Enter your password to delete your account." })
    }

    const client = await pool.connect()
    try {
        const user = await client.query('SELECT password FROM users WHERE id = $1', [id])
        if (user.rows.length === 0) {
            return res.status(404).json({ message: "No user found." })
        }

        const match = await bcrypt.compare(password, user.rows[0].password)
        if (!match) {
            return res.status(400).json({ message: "Incorrect password." })
        }

        await client.query('BEGIN')

        await client.query(
            `UPDATE posts SET is_claimed = false
             WHERE is_resolved = false AND id IN (SELECT post_id FROM claims WHERE claimant_id = $1)`,
            [id]
        )
        await client.query(
            'DELETE FROM claims WHERE claimant_id = $1 OR post_id IN (SELECT id FROM posts WHERE user_id = $1)',
            [id]
        )
        await client.query('DELETE FROM posts WHERE user_id = $1', [id])
        await client.query('DELETE FROM users WHERE id = $1', [id])

        await client.query('COMMIT')
        res.status(200).json({ message: "Account deleted." })
    } catch (error) {
        await client.query('ROLLBACK').catch(() => {})
        console.error(error)
        res.status(500).json({ message: 'Server error.' })
    } finally {
        client.release()
    }
})

module.exports = router