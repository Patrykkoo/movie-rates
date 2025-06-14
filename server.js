const express = require('express');
const path = require('path');
const movieController = require('./controllers/movieController');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engile', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', movieController.getHomePage);

// routingi...

app.listen(PORT, () => {
    console.log(`Serwer Movierates działa na porcie ${PORT}`);
    console.log(`Przejdź do http://localhost:${PORT}`);
});