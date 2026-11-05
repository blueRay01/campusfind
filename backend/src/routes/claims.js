const express = require('express')
const router = express.Router()
const pool = require('../config/db')
const authMiddleware = require('../middleware/auth')

router.post('/', authMiddleware, async(req, res) => {
    const user_id = req.user.id
    const { post_id } = req.body

    if (!post_id) {
        return res.status(400).json({ message: "Missing post_id." })
    }

    const client = await pool.connect()
    try {
        await client.query('BEGIN')

        // Only claim if: not your own post, not already claimed, not resolved.
        // Doing the check inside the UPDATE stops two people claiming at the same time.
        const locked = await client.query(
            `UPDATE posts SET is_claimed = true
             WHERE id = $1 AND user_id <> $2 AND is_claimed = false AND is_resolved = false
             RETURNING id`,
            [post_id, user_id]
        )

        if (locked.rows.length === 0) {
            await client.query('ROLLBACK')

            // Work out why, so the frontend can show a clear message
            const post = await client.query('SELECT user_id, is_claimed, is_resolved FROM posts WHERE id = $1', [post_id])
            if (post.rows.length === 0) {
                return res.status(404).json({ message: "Item not found." })
            }
            if (String(post.rows[0].user_id) === String(user_id)) {
                return res.status(403).json({ message: "You can't claim your own post." })
            }
            if (post.rows[0].is_resolved) {
                return res.status(409).json({ message: "This item has already been returned." })
            }
            return res.status(409).json({ message: "Someone has already claimed this item." })
        }

        const claim = await client.query(
            'INSERT INTO claims (post_id, claimant_id, status) VALUES ($1, $2, $3) RETURNING *',
            [post_id, user_id, 'pending']
        )

        await client.query('COMMIT')
        res.status(200).json(claim.rows[0])
    } catch (error) {
        await client.query('ROLLBACK').catch(() => {})
        console.error(error)
        res.status(500).json({message: "Server error."})
    } finally {
        client.release()
    }
})

router.get('/my', authMiddleware, async(req, res) => {
    try {
        const id = req.user.id
        const claim = await pool.query(
            `SELECT claims.id AS claim_id, claims.status, claims.created_at AS claimed_at,
                    posts.id AS post_id, posts.title, posts.image_url, posts.building, posts.room,
                    posts.pickup_location, posts.handed_to_security, posts.is_resolved
             FROM claims
             JOIN posts ON claims.post_id = posts.id
             WHERE claims.claimant_id = $1
             ORDER BY claims.created_at DESC`,
            [id]
        )
        res.status(200).json(claim.rows)

    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Server error."})
    }
})

// Only the owner of the post can change a claim's status
router.put('/:id', authMiddleware, async(req, res) => {
    try {
        const id = req.params.id
        const user_id = req.user.id
        const { status } = req.body
        const newStatus = await pool.query(
            `UPDATE claims SET status = $1
             WHERE id = $2 AND post_id IN (SELECT id FROM posts WHERE user_id = $3)
             RETURNING *`,
            [status, id, user_id]
        )

        if (newStatus.rows.length === 0) {
            return res.status(404).json({ message: "Claim not found."})
        } else {
            res.status(200).json(newStatus.rows[0])
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Server error."})
    }
})

router.delete('/:id', authMiddleware, async(req, res) => {
    try {
        const id = req.params.id
        const user_id = req.user.id
        const deleted = await pool.query('DELETE FROM claims WHERE id = $1 AND claimant_id = $2 RETURNING *', [id, user_id])

        if (deleted.rows.length === 0) {
            return res.status(404).json({ message: "Claim not found."})
        } else {
            await pool.query('UPDATE posts SET is_claimed = false WHERE id = $1', [deleted.rows[0].post_id])
            res.status(200).json({ message: "Claim removed."})
        }


    } catch (error) {

        console.error(error)
        res.status(500).json({ message: "Server error."})
    }
})

module.exports = router