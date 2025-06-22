const express = require('express');
const movieController = require('../controllers/movieController');
const router = express.Router();

router.post('/collection/status/:id', movieController.postUpdateMovieStatus);

router.get('/profile', movieController.getProfilePage);
router.get('/', movieController.getHomePage);

module.exports = router;