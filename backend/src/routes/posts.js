const express = require('express')
const router = express.Router()
const pool = require('../config/db')
const authMiddleWare = require('../middleware/auth')
const upload = require('../config/cloudinary')

router.get('/', async(req,res) => {
    
    try {
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
        const post = await pool.query('SELECT * FROM posts WHERE id = $1', [id])

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
        const { itemName, category, building, room, handedToSecurity } = req.body;
        const image_url = req.file ? req.file.path : null

        const newPost = await pool.query('INSERT INTO posts (user_id, title, category, building, room, image_url, status, handed_to_security) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [id, itemName, category, building, room, image_url, 'Found', handedToSecurity])

        res.status(200).json(newPost.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
})

router.patch('/:id/resolve', async(req, res) => {
    try {
        const id = req.params.id
        const updated_post = await pool.query('UPDATE posts SET is_resolved = true WHERE id = $1 RETURNING *', [id])

        if (updated_post.rows.length === 0) {
            return res.status(404).json({ message: "Post not found."})
        } else {
            res.status(200).json(updated_post.rows[0])
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    } 
})

router.delete('/:id', async(req, res) => {
    const id = req.params.id 

    try {
        const deleted_posts = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]) 

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