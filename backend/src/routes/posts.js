const express = require('express')
const router = express.Router()
const pool = require('../config/db')
const authMiddleWare = require('../middleware/auth')
const upload = require('../config/cloudinary')
const optionalAuth = require('../middleware/optionalAuth')

router.get('/', optionalAuth, async(req,res) => {
    
    try {
        if (req.user) {
            const posts = await pool.query('SELECT * FROM posts WHERE user_id != $1 ', [req.user.id])
            return res.status(200).json(posts.rows)
        }

        const posts = await pool.query('SELECT * FROM posts')
        res.status(200).json(posts.rows)
        
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Not found.'})
    }
})

router.get('/my', authMiddleWare, async(req, res) => {
    try {
        const id = req.user.id
        const post = await pool.query('SELECT * FROM posts WHERE user_id = $1 ORDER BY created_at DESC', [id])
        // An empty list is a normal answer, not an error
        res.status(200).json(post.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server error"})
    }
})

// Anyone can view a post. Contact details (messenger link, pickup spot) are only
// sent to the owner and to the person who claimed it.
router.get('/:id', optionalAuth, async(req, res) =>{
    try {
        const { id } = req.params
        const viewerId = req.user ? req.user.id : null

        const post = await pool.query(
            `SELECT posts.*, users.name AS reporter_name, users.messenger_link AS messenger_link,
                    EXISTS (
                        SELECT 1 FROM claims
                        WHERE claims.post_id = posts.id AND claims.claimant_id = $2
                    ) AS claimed_by_me
             FROM posts JOIN users ON posts.user_id = users.id
             WHERE posts.id = $1`,
            [id, viewerId]
        )

        if (post.rows.length === 0) {
            return res.status(404).json({ message: "No posts." });
        }

        const row = post.rows[0]
        row.is_own_post = viewerId !== null && String(row.user_id) === String(viewerId)

        if (!row.is_own_post && !row.claimed_by_me) {
            delete row.messenger_link
            delete row.pickup_location
        }

        res.status(200).json(row)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server error." });
    }
})

router.post('/', authMiddleWare, upload.single('image'), async(req, res) => {
    try {
        const id = req.user.id
        const { itemName, category, building, room, handedToSecurity, pickupLocation, description } = req.body;
        const image_url = req.file ? req.file.path : null

        const newPost = await pool.query(
            'INSERT INTO posts (user_id, title, category, building, room, image_url, status, handed_to_security, pickup_location, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
            [id, itemName, category, building, room, image_url, 'Found', handedToSecurity, pickupLocation || null, description || null]
        )

        res.status(200).json(newPost.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
})

router.patch('/:id', authMiddleWare, upload.single('image'), async(req, res) => {
    try {
        const id = req.params.id
        const user_id = req.user.id
        const { itemName, category, building, room, handedToSecurity, pickupLocation, description } = req.body;

        // Only update image_url if a new file was actually uploaded
        const existing = await pool.query('SELECT image_url FROM posts WHERE id = $1 AND user_id = $2', [id, user_id])
        if (existing.rows.length === 0) {
            return res.status(404).json({ message: "Post not found." })
        }
        const image_url = req.file ? req.file.path : existing.rows[0].image_url

        const updated = await pool.query(
            `UPDATE posts 
             SET title = $1, category = $2, building = $3, room = $4, image_url = $5, 
                 handed_to_security = $6, pickup_location = $7, description = $8
             WHERE id = $9 AND user_id = $10 RETURNING *`,
            [itemName, category, building, room, image_url, handedToSecurity, pickupLocation || null, description || null, id, user_id]
        )

        res.status(200).json(updated.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
})

router.patch('/:id/resolve', authMiddleWare, async(req, res) => {
    try {
        const id = req.params.id
        const user_id = req.user.id
        const updated_post = await pool.query('UPDATE posts SET is_resolved = true WHERE id = $1 AND user_id = $2 RETURNING *', [id, user_id])

        if (updated_post.rows.length === 0) {
            return res.status(404).json({ message: "Post not found."})
        } else {
            await pool.query('UPDATE claims SET status = $1 WHERE post_id = $2', ['resolved', id])
            res.status(200).json(updated_post.rows[0])
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    } 
})

router.delete('/:id', authMiddleWare, async(req, res) => {
    const id = req.params.id
    const user_id = req.user.id

    const client = await pool.connect()
    try {
        await client.query('BEGIN')

        const owned = await client.query('SELECT id FROM posts WHERE id = $1 AND user_id = $2', [id, user_id])
        if (owned.rows.length === 0) {
            await client.query('ROLLBACK')
            return res.status(404).json({ message : "Post not found."})
        }

        await client.query('DELETE FROM claims WHERE post_id = $1', [id])
        await client.query('DELETE FROM posts WHERE id = $1 AND user_id = $2', [id, user_id])

        await client.query('COMMIT')
        res.status(200).json({ message: "Post deleted successfully."})
    } catch (error) {
        await client.query('ROLLBACK').catch(() => {})
        console.error(error)
        res.status(500).json({ message: "Server error."})
    } finally {
        client.release()
    }
})

module.exports = router