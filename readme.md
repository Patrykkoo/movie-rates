# Movierates - Katalog Kolekcji Filmów

## Opis Projektu

**Movierates** to aplikacja internetowa napisana w Node.js, zrealizowana zgodnie z założeniami wzorca architektonicznego MVC, wykorzystując Server-Side Rendering (SSR). Aplikacja jest wieloużytkownikową platformą zintegrowaną z bazą danych SQLite, która służy do przeglądania filmów, recenzowania ich i tworzenia własnych kolekcji.

## Lista i Opis Funkcjonalności

* **System rejestracji i logowania:** Użytkownicy mogą tworzyć własne konta. Proces rejestracji jest zabezpieczony haszowaniem haseł (`bcrypt`), a zalogowani użytkownicy są utrzymywani w systemie dzięki sesjom (`express-session`).
* **Biblioteka filmów:** Strona główna prezentuje ogólnodostępną listę filmów, wyświetlając dla każdego z nich podgląd **średniej oceny** oraz **liczbę recenzji** dodanych przez społeczność.
* **Wyszukiwarka:** Aplikacja posiada wyszukiwarkę, pozwalającą na znajdowanie filmów po tytule, jego fragmencie lub danych reżysera.
* **Szczegółowe menu filmów:** Po kliknięciu na dowolny film otwiera się okno, w którym znajdują się:
    * Szczegółowe informacje o filmie.
    * Lista recenzji od innych użytkowników.
    * Formularz pozwalający zalogowanym użytkownikom (inaczej informuje o konieczności zalogowania się) na dodanie własnej oceny i recenzji. 
    * Przyciski do zarządzania własną kolekcją, dodając wybrane filmy do kolekcji: **"Do obejrzenia"**, **"Obejrzane"**.
* **Katalog użytkownika:** Podstrona `/profile` prezentuje kolekcje zalogowanego użytkownika, wykorzystując interfejs z zakładkami do przełączania się między listami.
* **Panel dodawania filmów:** Możliwość dodawania nowych filmów do globalnej bazy danych jest ograniczona tylko dla administratora o nazwie **"root"**.

## Instrukcja Uruchomienia Aplikacji

Do uruchomienia aplikacji wymagany jest **Node.js** (zalecana wersja v18.x lub nowsza) oraz menedżer pakietów **npm**.

1.  **Klonowanie repozytorium**
    ```bash
    git clone https://github.com/Patrykkoo/movie-rates
    cd movie-rates
    ```

2.  **Instalacja zależności**  
    W głównym folderze projektu uruchom komendę, aby zainstalować wszystkie wymagane biblioteki:
    ```bash
    npm install
    ```

3.  **Inicjalizacja bazy danych (opcjonalnie)**  
    Aby obsługiwać aplikację na "czystej" bazie danych, należy usunąć plik **/data/movierates.db** oraz jednorazowo ją zainicjować. Uruchom poniższą komendę w głównym folderze projektu:
    ```bash
    node database-setup.js
    ```
    *Ten skrypt stworzy plik `movierates.db` i wypełni go początkowymi danymi filmów z pliku JSON.*

4.  **Uruchomienie serwera**  
    Aby uruchomić serwer w trybie deweloperskim (z automatycznym przeładowywaniem po zmianach), użyj komendy:
    ```bash
    npm start
    ```

5.  **Dostęp do aplikacji**  
    Aplikacja będzie dostępna w przeglądarce pod adresem: `http://localhost:3001`.

## Wykorzystane Biblioteki Zewnętrzne

* **Express.js:** Framework webowy dla Node.js, używany do budowy serwera i routingu.
* **EJS:** Silnik szablonów do generowania dynamicznego kodu HTML.
* **Nodemon:** Narzędzie deweloperskie do automatycznego restartowania serwera.
* **sqlite3:** Sterownik umożliwiający aplikacji komunikację z plikową bazą danych SQLite.
* **bcrypt:** Biblioteka do bezpiecznego haszowania i weryfikacji haseł.
* **express-session:** Middleware do zarządzania sesjami użytkowników (np. "pamiętania" o zalogowaniu).
* **async:** Biblioteka pomocnicza do zarządzania wieloma asynchronicznymi operacjami na bazie danych.

## Struktura Aplikacji

Aplikacja jest zorganizowana zgodnie ze wzorcem **Model-View-Controller (MVC)**.

* **`/config/database.js`**: Centralny moduł zarządzający połączeniem z bazą danych SQLite.
* **`/controllers`**:
    * `movieController.js`: Obsługuje logikę związaną z wyświetlaniem filmów, profili i obsługą modala.
    * `authController.js`: Zarządza logiką rejestracji, logowania i wylogowywania użytkowników.
* **`/data/movierates.db`**: Plik bazy danych SQLite, przechowujący wszystkie dane aplikacji (użytkowników, filmy, recenzje, kolekcje).
* **`/middleware/authMiddleware.js`**: Zawiera funkcje `isAdmin`, do kontroli dostępu do określonych ścieżek.
* **`/models`**:
    * `movie.js`: Model odpowiedzialny za wszystkie operacje na bazie danych związane z filmami, recenzjami i kolekcjami.
    * `user.js`: Model zarządzający operacjami na tabeli użytkowników (tworzenie, wyszukiwanie, weryfikacja hasła).
* **`/public`**: Folder na frontend.
    * `/css/style.css`: Główny arkusz stylów aplikacji.
    * `/js/modal.js`, `/star-rating.js`, `/js/tabs.js`: Skrypty JavaScript odpowiedzialne za interaktywność interfejsu.
* **`/routes`**:
    * `movieRoutes.js`: Definiuje URL związane z filmami i profilem.
    * `authRoutes.js`: Definiuje URL związane z procesem autoryzacji użytkowników.
* **`/views`**: Szablony EJS odpowiedzialne za warstwę prezentacji.
* **`database-setup.js`**: Jednorazowy skrypt do inicjalizacji schematu bazy danych i migracji początkowych danych z pliku JSON.
* **`server.js`**: Główny plik startowy aplikacji, który łączy wszystkie elementy.

## Testowanie aplikacji

W celu testowania aplikacji zostało utworzonych trzech użytkowników, korzystających z wszystkich funkcjonalności biblioteki filmów.

**Administrator z możliwością dodawania nowych filmów do biblioteki:** 
* **Login:** root, **Hasło:** root

**Testowi użytkownicy z przykładowymi recenzjami oraz filmami w katalogu:**
* **Login:** Test1, **Hasło:** Test1
* **Login:** Test2, **Hasło:** Test2