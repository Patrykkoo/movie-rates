const Movie = require('../models/movie');
const async = require('async');

exports.getHomePage = (req, res) => {
    const searchTerm = req.query.search;
    const userId = req.session.userId;

    const fetchCollectionAndRender = (movies) => {
        if (!userId) {
            return res.render('index', {
                pageTitle: 'Movierates - Biblioteka Filmów',
                movies: movies,
                collectionStatus: new Map(),
                searchTerm: searchTerm
            });
        }
        Movie.fetchCollectionForUser(userId, (err, collectionMovies) => {
            if (err) return res.status(500).send("Błąd serwera.");
            const collectionStatus = new Map(collectionMovies.map(movie => [movie.id, movie.status]));
            res.render('index', {
                pageTitle: 'Movierates - Wyniki Wyszukiwania',
                movies: movies,
                collectionStatus: collectionStatus,
                searchTerm: searchTerm
            });
        });
    };
    
    if (searchTerm && searchTerm.trim() !== '') {
        Movie.search(searchTerm, (err, movies) => {
            if (err) return res.status(500).send("Błąd serwera podczas wyszukiwania.");
            fetchCollectionAndRender(movies);
        });
    } else {
        Movie.fetchAll((err, movies) => {
            if (err) return res.status(500).send("Błąd serwera podczas pobierania filmów.");
            fetchCollectionAndRender(movies);
        });
    }
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
        return res.status(401).json({ error: "Musisz być zalogowany." });
    }

    Movie.addOrUpdateStatus(userId, movieId, status, (err) => {
        if (err) {
            return res.status(500).json({ error: "Błąd podczas dodawania filmu do kolekcji." });
        }
        res.json({ success: true, newStatus: status });
    });
};

exports.postRemoveFromCollection = (req, res) => {
    const userId = req.session.userId;
    const movieId = req.params.id;

    if (!userId) {
        return res.status(401).json({ error: "Brak autoryzacji." });
    }

    Movie.removeFromCollection(userId, movieId, (err, changes) => {
        if (err) {
            return res.status(500).json({ error: "Błąd serwera podczas usuwania filmu z kolekcji." });
        }
        res.json({ success: true, newStatus: null });
    });
};

exports.getMovieDetails = (req, res) => {
    const movieId = req.params.id;
    const userId = req.session.userId;

    async.parallel({
        movie: (callback) => Movie.findById(movieId, callback),
        reviews: (callback) => Movie.fetchReviewsForMovie(movieId, callback),
        status: (callback) => {
            if (!userId) return callback(null, null);
            Movie.fetchStatusForUser(userId, movieId, callback);
        },
        userReview: (callback) => {
            if (!userId) return callback(null, null);
            Movie.fetchUserReviewForMovie(userId, movieId, callback);
        }
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

    Movie.addReview(userId, movieId, rating, review_text, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Błąd podczas zapisywania recenzji.' });
        }
        res.status(200).json({ success: true });
    });
};