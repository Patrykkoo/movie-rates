const User = require('../models/user');

exports.getRegisterPage = (req, res) => {
    const errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;

    res.render('register', {
        pageTitle: 'Rejestracja',
        errorMessage: errorMessage
    });
};

exports.postRegister = (req, res) => {
    const { username, password } = req.body;
    User.create(username, password, (err, user) => {
        if (err) {
            if (err.code === 'SQLITE_CONSTRAINT') {
                req.session.errorMessage = 'Użytkownik o takiej nazwie już istnieje.';
            } else {
                req.session.errorMessage = 'Wystąpił błąd podczas rejestracji.';
            }
            return res.redirect('/register');
        }
        res.redirect('/login');
    });
};

exports.getLoginPage = (req, res) => {
    const errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;

    res.render('login', {
        pageTitle: 'Logowanie',
        errorMessage: errorMessage
    });
};

exports.postLogin = (req, res) => {
    const { username, password } = req.body;
    User.findByUsername(username, (err, user) => {
        if (err || !user) {
            req.session.errorMessage = 'Nieprawidłowy login lub hasło.';
            return res.redirect('/login');
        }
        User.verifyPassword(password, user.password, (err, isMatch) => {
            if (err || !isMatch) {
                req.session.errorMessage = 'Nieprawidłowy login lub hasło.';
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