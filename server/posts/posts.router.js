const express = require('express');
const { fetchPosts } = require('./posts.service');
const { fetchUserById } = require('../users/users.service');
const axios = require('axios').default;
const router = express.Router();

router.get('/', async (req, res) => {
  try {

    const start = parseInt(req.query.start, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 10;

    // Fetch posts with the start and limit parameters
    const posts = await fetchPosts({ start, limit });

    const postsWithImagesPromises = posts.map(async (post) => {
      try {
        // Fetch photos and user data in parallel
        const [photosResponse, user] = await Promise.all([
          axios.get(`https://jsonplaceholder.typicode.com/albums/${post.id}/photos`),
          fetchUserById(post.userId)
        ]);
        return {
          ...post,
          images: photosResponse.data,
          username: user ? user.name:null ,
          email: user ? user.email:null 
        };
      } catch (error) {
        console.error(`Error processing post ${post.id}:`, error);
        return {
          ...post,
          images: [],
          username: null,
          email: null
        };
      }
    });

    const postsWithImages = await Promise.all(postsWithImagesPromises);

    res.json(postsWithImages);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

module.exports = router;
