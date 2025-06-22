const Movie = require('../models/movie');

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
        res.redirect('back');
    });
};