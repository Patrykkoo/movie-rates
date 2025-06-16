# Movierates - Kolekcja Filmów

## Opis Projektu

**Movierates** to aplikacja internetowa napisana w Node.js, zrealizowana zgodnie z założeniami wzorca architektonicznego MVC (Model-View-Controller) oraz wykorzystująca renderowanie po stronie serwera (SSR). Celem projektu jest umożliwienie użytkownikowi przeglądania obszernej biblioteki filmów oraz tworzenia i zarządzania własną, spersonalizowaną kolekcją. Użytkownik może dodawać filmy do swojego katalogu, oceniać je, dodawać statusy oglądania oraz pisać krótkie recenzje.

## Lista i Opis Funkcjonalności

* **Przeglądanie Głównej Biblioteki Filmów:** Aplikacja wyświetla listę wszystkich filmów dostępnych w globalnej bazie danych (`movieDB.json`).
* **Tworzenie Prywatnej Kolekcji:** Użytkownik ma możliwość dodania dowolnego filmu z głównej biblioteki do swojego prywatnego katalogu.
* **Podstrona Profilu:** Dedykowana podstrona `/profile`, na której wyświetlane są tylko filmy dodane przez użytkownika do jego kolekcji.
* **Ocenianie Filmów:** W swoim katalogu użytkownik może ocenić film w skali 1-10 za pomocą interaktywnego systemu gwiazdek. Ocena jest zapisywana i widoczna w podsumowaniu.
* **Dodawanie Recenzji i Statusu:** Do każdego filmu w kolekcji można dodać własną recenzję tekstową oraz ustawić status oglądania ("Do obejrzenia", "W trakcie", "Obejrzany").
* **Edycja Danych w Kolekcji:** Użytkownik może w dowolnym momencie edytować swoją ocenę, recenzję i status dla filmów w swoim katalogu.
* **Trwałość Danych:** Wszystkie dane – zarówno globalna biblioteka, jak i kolekcja użytkownika są trwale przechowywane w plikach JSON na serwerze.
* **Dodawanie Filmów do Globalnej Bazy:** Aplikacja wciąż posiada funkcjonalność dodawania nowych filmów do głównej biblioteki poprzez formularz na podstronie `/add-movie`.

## Instrukcja Uruchomienia Aplikacji

Do uruchomienia aplikacji wymagany jest **Node.js** (zalecana wersja v18.x lub nowsza) oraz menedżer pakietów **npm**.

1.  **Klonowanie Repozytorium**
    ```bash
    git clone <adres-twojego-repozytorium>
    cd <nazwa-folderu-projektu>
    ```

2.  **Instalacja Zależności**
    W głównym folderze projektu uruchom komendę, aby zainstalować wszystkie wymagane biblioteki:
    ```bash
    npm install
    ```

3.  **Uruchomienie Serwera**
    Aby uruchomić serwer w trybie deweloperskim (z automatycznym przeładowywaniem po zmianach), użyj komendy:
    ```bash
    npm start
    ```

4.  **Dostęp do Aplikacji**
    Aplikacja będzie dostępna w przeglądarce pod adresem: `http://localhost:3001`.

## Wykorzystane Biblioteki Zewnętrzne

* **Express.js:** Minimalistyczny i elastyczny framework webowy dla Node.js, używany do budowy serwera, obsługi żądań HTTP i routingu.
* **EJS (Embedded JavaScript templating):** Silnik szablonów, który pozwala na generowanie dynamicznego kodu HTML po stronie serwera poprzez osadzanie w nim logiki JavaScript.
* **Nodemon:** Narzędzie deweloperskie, które automatycznie restartuje serwer Node.js po wykryciu zmian w plikach projektu, co znacznie przyspiesza proces tworzenia aplikacji.

## Struktura Aplikacji

Aplikacja jest zorganizowana zgodnie ze wzorcem **Model-View-Controller (MVC)**.

* **`/models/movie.js`**
    * **Model:** Warstwa danych aplikacji. Odpowiada za całą logikę operacji na plikach `movieDB.json` (globalna biblioteka) i `user-collection.json` (kolekcja użytkownika). Zawiera metody do odczytywania, zapisywania, aktualizowania i wyszukiwania danych.

* **`/views`**
    * **Widoki:** Warstwa prezentacji, odpowiedzialna za interfejs użytkownika. Są to pliki `.ejs`, które zawierają szablony HTML z osadzoną logiką do dynamicznego wyświetlania danych przekazanych z kontrolera.
    * `index.ejs`: Widok strony głównej z biblioteką filmów.
    * `profile.ejs`: Widok katalogu użytkownika.
    * `add-movie.ejs`: Widok formularza dodawania filmów.
    * `partials/header.ejs`, `partials/footer.ejs`: Reużywalne fragmenty widoków dla zachowania spójności interfejsu.

* **`/controllers/movieController.js`**
    * **Kontroler:** Pośrednik między modelem a widokiem. Odbiera żądania HTTP zdefiniowane w routerze, komunikuje się z modelem w celu przetworzenia danych, a następnie wywołuje odpowiedni widok, przekazując mu potrzebne informacje.

* **`/routes/movieRoutes.js`**
    * **Router:** Definiuje wszystkie ścieżki (URL) aplikacji i mapuje je do odpowiednich funkcji w kontrolerze. Oddziela logikę routingu od głównego pliku serwera.

* **`/public`**
    * Folder na zasoby statyczne, dostępne po stronie klienta (frontend).
    * `/css/style.css`: Główny arkusz stylów aplikacji.
    * `/js/star-rating.js`: Skrypt JavaScript do obsługi interaktywnego oceniania gwiazdkami.

* **`/data`**
    * Folder pełniący rolę bazy danych.
    * `movieDB.json`: Globalna baza filmów.
    * `user-collection.json`: Baza przechowująca prywatną kolekcję użytkownika.

* **`server.js`**
    * Główny plik startowy aplikacji. Inicjalizuje serwer Express, konfiguruje silnik widoków, podłącza router oraz uruchamia nasłuchiwanie na określonym porcie.

## Przykładowe Dane Wejściowe 

Aplikacja wykorzystuje formularze do wprowadzania danych przez użytkownika.

* **Formularz dodawania filmu do bazy (`/add-movie`):**
    * **Tytuł:** `string` (np. "Incepcja")
    * **Reżyser:** `string` (np. "Christopher Nolan")
    * **Rok premiery:** `number` (np. 2010)
    * **URL do plakatu:** `string` (URL)
    * **Krótki opis fabuły:** `string` (tekst)

* **Formularz edycji w katalogu użytkownika (`/profile`):**
    * **Status:** `string` (wybór z listy: "Do obejrzenia", "W trakcie", "Obejrzany")
    * **Ocena:** `number` (od 1 do 10, ustawiane za pomocą gwiazdek)
    * **Recenzja:** `string` (tekst)