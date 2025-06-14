const express = require('express');
const movieController = require('../controllers/movieController');

const router = express.Router();

router.get('/', movieController.getHomePage);
router.get('/add-movie', movieController.getAddMoviePage);
router.post('/add-movie', movieController.postAddMovie);
router.post('/update-movie/:id', movieController.postUpdateMovie);

module.exports = router;