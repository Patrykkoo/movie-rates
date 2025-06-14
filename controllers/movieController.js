const Movie = require('../models/movie');

// Wyświetla globalną bibliotekę
const getHomePage = (req, res) => {
    res.render('index', {
        pageTitle: 'Movierates - Biblioteka Filmów',
        movies: Movie.fetchAll()
    });
};

// Wyświetla profil użytkownika z jego kolekcją
const getProfilePage = (req, res) => {
    res.render('profile', {
        pageTitle: 'Mój Katalog Filmów',
        collectionMovies: Movie.fetchCollection()
    });
};

// Dodaje film do kolekcji użytkownika
const postAddToCollection = (req, res) => {
    const movieId = req.params.id;
    Movie.addToCollection(movieId);
    res.redirect('/');
};

// Aktualizuje film w kolekcji użytkownika
const postUpdateMovieInCollection = (req, res) => {
    const { id } = req.params;
    const { status, rating, review } = req.body;
    Movie.updateInCollection(id, { status, rating, review });
    res.redirect('/profile');
};

// Wyświetla formularz dodawania filmu do bazy
const getAddMoviePage = (req, res) => {
    res.render('add-movie', {
        pageTitle: 'Dodaj film do Bazy'
    });
};

// Dodaje film do bazy
const postAddMovie = (req, res) => {
    const { title, director, year, posterUrl, plot } = req.body;
    Movie.save({ title, director, year, posterUrl, plot });
    res.redirect('/');
};

module.exports = {
    getHomePage,
    getProfilePage,
    postAddToCollection,
    postUpdateMovieInCollection,
    getAddMoviePage,
    postAddMovie
};