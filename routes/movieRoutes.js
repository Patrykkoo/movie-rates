const express = require('express');
const movieController = require('../controllers/movieController');
const router = express.Router();

router.get('/', movieController.getHomePage);
router.get('/profile', movieController.getProfilePage);
router.post('/collection/add/:id', movieController.postAddToCollection);
router.post('/collection/update/:id', movieController.postUpdateMovieInCollection); // Zmieniona ścieżka
router.get('/add-movie', movieController.getAddMoviePage);
router.post('/add-movie', movieController.postAddMovie);

module.exports = router;