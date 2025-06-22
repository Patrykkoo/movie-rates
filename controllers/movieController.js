const Movie = require('../models/movie');
const async = require('async');

exports.getHomePage = (req, res) => {
    Movie.fetchAll((err, movies) => {
        if (err) {
            return res.status(500).send("Błąd serwera podczas pobierania filmów.");
        }
        res.render('index', {
            pageTitle: 'Movierates - Biblioteka Filmów',
            movies: movies
        });
    });
};

exports.getProfilePage = (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.redirect('/login');
    }

    Movie.fetchCollectionForUser(userId, (err, collectionMovies) => {
        if (err) {
            return res.status(500).send("Błąd serwera podczas pobierania Twojej kolekcji.");
        }

        const watchedMovies = collectionMovies.filter(m => m.status === 'Obejrzane');
        const toWatchMovies = collectionMovies.filter(m => m.status === 'Do obejrzenia');
        
        res.render('profile', {
            pageTitle: 'Mój Katalog Filmów',
            watchedMovies: watchedMovies,
            toWatchMovies: toWatchMovies
        });
    });
};

exports.postUpdateMovieStatus = (req, res) => {
    const userId = req.session.userId;
    const movieId = req.params.id;
    const { status } = req.body;

    if (!userId) {
        return res.status(401).send("Musisz być zalogowany, aby dodać film do kolekcji.");
    }

    Movie.addOrUpdateStatus(userId, movieId, status, (err) => {
        if (err) {
            return res.status(500).send("Błąd podczas dodawania filmu do kolekcji.");
        }
        res.redirect('/');
    });
};

exports.getMovieDetails = (req, res) => {
    const movieId = req.params.id;

    async.parallel({
        movie: (callback) => Movie.findById(movieId, callback),
        reviews: (callback) => Movie.fetchReviewsForMovie(movieId, callback)
    }, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Błąd serwera' });
        }
        if (!results.movie) {
            return res.status(404).json({ error: 'Nie znaleziono filmu' });
        }
        res.json(results);
    });
};

exports.postReview = (req, res) => {
    const userId = req.session.userId;
    const movieId = req.params.id;
    const { rating, review_text } = req.body;

    if (!userId) {
        return res.status(401).json({ error: 'Musisz być zalogowany.' });
    }

    Movie.addOrUpdateReview(userId, movieId, rating, review_text, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Błąd podczas zapisywania recenzji.' });
        }
        res.status(200).json({ success: true });
    });
};