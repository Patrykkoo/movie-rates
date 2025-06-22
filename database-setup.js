// Ten plik należy uruchomić tylko raz, aby zainicjować bazę danych

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'data', 'movierates.db');
const oldDbPath = path.join(__dirname, 'data', 'movieDB.json');

// Połączenie z bazą, jeśli plik bazy nie istnieje, zostanie automatycznie utworzony
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        return console.error('Błąd łączenia z SQLite:', err.message);
    }
    console.log('Połączono z SQLite.');
});

// Schemat bazy
const createTablesQueries = `
    CREATE TABLE IF NOT EXISTS movies (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        year INTEGER,
        director TEXT,
        plot TEXT,
        posterUrl TEXT
    );

    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rating INTEGER NOT NULL,
        review_text TEXT,
        user_id INTEGER NOT NULL,
        movie_id TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (movie_id) REFERENCES movies (id)
    );

    CREATE TABLE IF NOT EXISTS user_movie_status (
        user_id INTEGER NOT NULL,
        movie_id TEXT NOT NULL,
        status TEXT NOT NULL,
        PRIMARY KEY (user_id, movie_id),
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (movie_id) REFERENCES movies (id)
    );
`;

// Migracja danych z pliku movieDB.json
const migrateOldData = () => {
    fs.readFile(oldDbPath, 'utf8', (err, data) => {
        if (err) {
            console.log('Plik movieDB.json nie istnieje.');
            return;
        }

        const oldData = JSON.parse(data);
        const moviesToInsert = oldData.movies;

        if (!moviesToInsert || moviesToInsert.length === 0) {
            console.log('Brak filmów do migracji w movieDB.json.');
            return;
        }

        const insertStmt = db.prepare("INSERT OR IGNORE INTO movies (id, title, year, director, plot, posterUrl) VALUES (?, ?, ?, ?, ?, ?)");

        console.log('Migracja filmów ze starej bazy...');
        db.serialize(() => {
            moviesToInsert.forEach(movie => {
                insertStmt.run(
                    movie.id.toString(),
                    movie.title,
                    parseInt(movie.year, 10),
                    movie.director,
                    movie.plot,
                    movie.posterUrl
                );
            });

            insertStmt.finalize((err) => {
                if (err) {
                    return console.error('Błąd podczas finalizowania migracji:', err.message);
                }
                console.log('Migracja filmów zakończona pomyślnie!');
                
                db.close((err) => {
                    if (err) {
                        return console.error(err.message);
                    }
                    console.log('Zamknięto połączenie z bazą danych.');
                });
            });
        });
    });
}

db.serialize(() => {
    console.log('Tworzenie tabel...');
    db.exec(createTablesQueries, (err) => {
        if (err) {
            return console.error('Błąd podczas tworzenia tabel:', err.message);
        }
        console.log('Tabele zostały utworzone pomyślnie (lub już istniały).');
        
        migrateOldData();
    });
});