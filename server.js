const express = require('express');
const path = require('path');
const session = require('express-session');

// Importujemy routery
const movieRoutes = require('./routes/movieRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'bardzo-tajny-klucz-sesji',
    resave: false,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    res.locals.isAuthenticated = !!req.session.userId;
    res.locals.username = req.session.username;
    next();
});

app.use('/', movieRoutes);
app.use('/', authRoutes);

app.listen(PORT, () => {
    console.log(`Serwer Movierates działa na porcie ${PORT}`);
    console.log(`Przejdź do http://localhost:${PORT}`);
});