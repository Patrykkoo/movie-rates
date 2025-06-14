const express = require('express');
const path = require('path');

const movieRoutes = require('./routes/movieRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', movieRoutes);

app.listen(PORT, () => {
    console.log(`Serwer Movierates działa na porcie ${PORT}`);
    console.log(`Przejdź do http://localhost:${PORT}`);
});