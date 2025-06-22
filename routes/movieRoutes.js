const express = require('express');
const movieController = require('../controllers/movieController');
const router = express.Router();

router.post('/collection/status/:id', movieController.postUpdateMovieStatus);
router.post('/collection/remove/:id', movieController.postRemoveFromCollection);

router.get('/movie-details/:id', movieController.getMovieDetails);
router.post('/movie/:id/review', movieController.postReview);

router.get('/profile', movieController.getProfilePage);
router.get('/', movieController.getHomePage);

module.exports = router;