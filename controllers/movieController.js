const getHomePage = (req, res) => {
    res.render('index', {
        pageTitle: 'Movierates - Twoja kolekcja filmów'
    });
};

module.exports = {
    getHomePage
};