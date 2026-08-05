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
        const post = await pool.query('SELECT * FROM posts WHERE user_id = $1', [id])

        if (post.rows.length === 0) {
            return res.status(404).json({ message: "No posts"})
        } else {
            res.status(200).json(post.rows)
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server error"})
    }
})  

router.get('/:id', async(req, res) =>{
    try {
        const { id } = req.params
        const post = await pool.query('SELECT posts.*, users.name AS reporter_name, users.messenger_link AS messenger_link, users.email AS email FROM posts JOIN users ON posts.user_id = users.id WHERE posts.id = $1', [id])

        if (post.rows.length === 0) {
            return res.status(404).json({ message: "No posts." });
        } 
        res.status(200).json(post.rows[0])
    } catch (error) {
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

    try {
        const deleted_posts = await pool.query('DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING *', [id, user_id]) 

        if (deleted_posts.rows.length === 0) {
            return res.status(404).json({ message : "Post not found."})
        } else {
            res.status(200).json({ message: "Post deleted successfully."})
        }
        
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server error."})
    } 

})

module.exports = router