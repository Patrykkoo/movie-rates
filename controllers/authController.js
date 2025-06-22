const User = require('../models/user');

exports.getRegisterPage = (req, res) => {
    res.render('register', { pageTitle: 'Rejestracja' });
};

exports.postRegister = (req, res) => {
    const { username, password } = req.body;
    User.create(username, password, (err, user) => {
        if (err) {
            console.error(err);
            return res.redirect('/register');
        }
        res.redirect('/login');
    });
};

exports.getLoginPage = (req, res) => {
    res.render('login', { pageTitle: 'Logowanie' });
};

exports.postLogin = (req, res) => {
    const { username, password } = req.body;
    User.findByUsername(username, (err, user) => {
        if (err || !user) {
            return res.redirect('/login');
        }
        User.verifyPassword(password, user.password, (err, isMatch) => {
            if (err || !isMatch) {
                return res.redirect('/login');
            }
            req.session.userId = user.id;
            req.session.username = user.username;
            res.redirect('/profile');
        });
    });
};

exports.postLogout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
        }
        res.redirect('/');
    });
};