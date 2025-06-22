const Movie = require('../models/movie');

const getHomePage = (req, res) => {
    Movie.fetchAll((err, movies) => {
        if (err) {
            res.status(500).send("Błąd serwera podczas pobierania filmów.");
            return;
        }

        res.render('index', {
            pageTitle: 'Movierates - Biblioteka Filmów',
            movies: movies
        });
    });
};


const getProfilePage = (req, res) => {
    res.render('profile', {
        pageTitle: 'Mój Katalog Filmów',
        collectionMovies: []
    });
}


module.exports = {
    getHomePage,
    getProfilePage
};