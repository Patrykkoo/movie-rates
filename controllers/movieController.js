const Movie = require('../models/movie');

const getHomePage = (req, res) => {
    const movies = Movie.fetchAll();

    res.render('index', {
        pageTitle: 'Movierates - Twoja kolekcja filmów',
        movies: movies
    });
};

module.exports = {
    getHomePage
};