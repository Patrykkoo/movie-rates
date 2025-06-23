const isAdmin = (req, res, next) => {
    if (req.session.userId && req.session.username === 'root') {
        next();
    } else {
        res.redirect('/');
    }
};

module.exports = { isAdmin };