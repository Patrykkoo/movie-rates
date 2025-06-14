const Movie = require('../models/movie');

const getHomePage = (req, res) => {
    const movies = Movie.fetchAll();

    res.render('index', {
        pageTitle: 'Movierates - Twoja kolekcja filmów',
        movies: movies
    });
};

// Renderowanie strony z formularzem
const getAddMoviePage = (req, res) => {
    res.render('add-movie', {
        pageTitle: 'Dodaj nowy film'
    });
};

// Obsługa danych z formularza
const postAddMovie = (req, res) => {
    const { title, director, year, posterUrl, plot } = req.body;

    const newMovie = {
        title,
        director,
        year,
        posterUrl,
        plot,
        genres: []
    };

    Movie.save(newMovie);
    res.redirect('/');
};

const postUpdateMovie = (req, res) => {
    const { id } = req.params;
    const { status, rating, review } = req.body;

    Movie.update(id, { status, rating, review });
    res.redirect('/');
}

module.exports = {
    getHomePage,
    getAddMoviePage,
    postAddMovie,
    postUpdateMovie
};