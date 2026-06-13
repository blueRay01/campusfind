const express = require('express')
const router = express.Router()
const pool = require('../config/db')
const authMiddleware = require('../middleware/auth')

router.post('/', authMiddleware, async(req, res) => {

    try {
        const user_id = req.user.id
        const {post_id} = req.body
        const claim = await pool.query('INSERT INTO claims (post_id, claimant_id) VALUES ($1, $2) RETURNING *', [post_id, user_id] )

        res.status(200).json(claim.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Server error."})
    }
})

router.get('/my', authMiddleware, async(req, res) => {
    try {
        const id = req.user.id
        const claim = await pool.query('SELECT * FROM claims WHERE claimant_id = $1', [id])
        res.status(200).json(claim.rows)

    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Server error."})
    }
})

router.put('/:id', authMiddleware, async(req, res) => {
    try {
        const id = req.params.id
        const { status } = req.body
        const newStatus = await pool.query('UPDATE claims SET status = $1 WHERE id = $2 RETURNING *', [status, id])

        if (newStatus.rows.length === 0) {
            return res.status(404).json({ message: "Claim not found."})
        } else {
            res.status(200).json(newStatus.rows[0])
        }

    } catch (error) {
        res.status(500).json({message: "Server error."})
    }
})

router.delete('/:id', authMiddleware, async(req, res) => {
    try {
        const id = req.params.id
        const deleted = await pool.query('DELETE FROM claims WHERE id = $1 RETURNING *', [id])
        
        if (deleted.rows.length === 0) {
            return res.status(404).json({ message: "Claim not found."})
        } else {
            res.status(200).json({ message: "Claim removed."})
        }
        
        
    } catch (error) {

        console.error(error)
        res.status(500).json({ message: "Server error."})
    }
})

module.exports = router