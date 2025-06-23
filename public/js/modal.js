document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('movie-modal');
    if (!modal) return;

    const modalBody = document.getElementById('modal-body');
    const closeBtn = modal.querySelector('.modal-close-btn');
    let currentMovieId = null;

    document.body.addEventListener('click', async (e) => {
        if (e.target.classList.contains('details-btn')) {
            currentMovieId = e.target.dataset.movieId;
            await openModalForMovie(currentMovieId);
        }
    });

    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    async function openModalForMovie(movieId) {
        try {
            const response = await fetch(`/movie-details/${movieId}`);
            if (!response.ok) throw new Error('Nie udało się pobrać danych filmu.');
            
            const data = await response.json();
            modalBody.innerHTML = generateModalHtml(data);
            modal.style.display = 'flex';
            
            initializeModalEventListeners(movieId);

        } catch (error) {
            console.error('Błąd w openModalForMovie:', error);
            modalBody.innerHTML = `<p class="error-message">Nie można załadować szczegółów filmu.</p>`;
            modal.style.display = 'flex';
        }
    }

    function generateModalHtml({ movie, reviews, status, userReview }) {
        let reviewsHtml = '<p>Brak recenzji. Bądź pierwszy!</p>';
        if (reviews && reviews.length > 0) {
            reviewsHtml = reviews.map(r => `
                <div class="review-item">
                    <p class="review-author"><strong>${r.username}</strong> ocenił na <span class="review-stars">${'&#9733;'.repeat(r.rating)}${'&#9734;'.repeat(10 - r.rating)}</span></p>
                    <p class="review-text">${r.review_text}</p>
                </div>
            `).join('');
        }
        
        const isAuthenticated = document.body.dataset.isAuthenticated === 'true';
        let userActionsHtml = '<p><a href="/login">Zaloguj się</a>, aby oceniać i dodawać filmy do swojej kolekcji.</p>';
        
        if (isAuthenticated) {
            let actionButtons = '';
            if (status === 'Obejrzane') {
                actionButtons = `<form class="action-form" data-action="/collection/remove/${movie.id}" method="POST"><button type="submit" class="btn btn-added">✓ Obejrzane</button></form>`;
            } else if (status === 'Do obejrzenia') {
                actionButtons = `<form class="action-form" data-action="/collection/remove/${movie.id}" method="POST"><button type="submit" class="btn btn-secondary btn-added">✓ Do obejrzenia</button></form>`;
            } else {
                actionButtons = `
                    <form class="action-form" data-action="/collection/status/${movie.id}" method="POST">
                        <input type="hidden" name="status" value="Do obejrzenia">
                        <button type="submit" class="btn btn-secondary">Do obejrzenia</button>
                    </form>
                    <form class="action-form" data-action="/collection/status/${movie.id}" method="POST">
                        <input type="hidden" name="status" value="Obejrzane">
                        <button type="submit" class="btn">Obejrzane</button>
                    </form>`;
            }

            let reviewSectionHtml = '';
            if (userReview) {
                reviewSectionHtml = `
                    <h3>Twoja Ocena</h3>
                    <div class="user-review-summary">
                        <p class="review-author">Oceniłeś na <span class="review-stars">${'&#9733;'.repeat(userReview.rating)}${'&#9734;'.repeat(10 - userReview.rating)}</span></p>
                        <p class="review-text">${userReview.review_text || '<em>Brak treści recenzji.</em>'}</p>
                    </div>
                `;
            } else {
                reviewSectionHtml = `
                    <h3>Twoja Ocena i Recenzja</h3>
                    <form id="review-form">
                        <div class="rating-review-layout">
                            <div class="rating-column">
                                <label>Ocena <span class="rating-display-value">0/10</span></label>
                                <div class="star-rating-widget">
                                    <input type="hidden" name="rating" class="rating-value" value="0">
                                    ${[...Array(10).keys()].map(i => `<span class="star" data-value="${i + 1}">&#9733;</span>`).join('')}
                                </div>
                            </div>
                            <div class="review-column">
                                <label for="review_text">Recenzja</label>
                                <textarea name="review_text" rows="4" placeholder="Napisz swoją recenzję..."></textarea>
                            </div>
                        </div>
                        <button type="submit" class="btn">Zapisz recenzję</button>
                    </form>
                `;
            }

            userActionsHtml = `
                <div class="modal-actions">${actionButtons}</div>
                <hr>
                ${reviewSectionHtml}
            `;
        }

        return `
            <div class="modal-layout">
                <div class="modal-poster-container">
                    <img src="${movie.posterUrl || 'https://placehold.co/400x600/2a2a2a/e0e0e0?text=Brak+plakatu'}" class="modal-poster">
                </div>
                <div class="modal-info">
                    <h2>${movie.title} (${movie.year})</h2>
                    <p><strong>Reżyser:</strong> ${movie.director}</p>
                    <p>${movie.plot}</p>
                    ${userActionsHtml}
                </div>
            </div>
            <div class="modal-reviews">
                <h3>Recenzje Społeczności</h3>
                <div class="reviews-list">${reviewsHtml}</div>
            </div>`;
    }
    
    function initializeModalEventListeners(movieId) {
        const starWidget = modal.querySelector('.star-rating-widget');
        if(starWidget) {
            const stars = starWidget.querySelectorAll('.star');
            const ratingInput = starWidget.querySelector('.rating-value');
            const ratingDisplay = modal.querySelector('.rating-display-value');

            const setRating = (rating) => {
                stars.forEach(star => {
                    star.classList.toggle('selected', parseInt(star.dataset.value) <= rating);
                });
            };

            stars.forEach(star => {
                star.addEventListener('click', () => {
                    const value = star.dataset.value;
                    ratingInput.value = value;
                    ratingDisplay.textContent = `${value}/10`;
                    setRating(value);
                });
                star.addEventListener('mouseover', () => {
                    const hoverValue = star.dataset.value;
                    stars.forEach((s, index) => {
                        s.classList.toggle('hover', index < hoverValue);
                    });
                });
            });

            starWidget.addEventListener('mouseleave', () => {
                stars.forEach(s => s.classList.remove('hover'));
            });
        }
        
        const reviewForm = modal.querySelector('#review-form');
        if (reviewForm) {
            reviewForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const rating = reviewForm.querySelector('.rating-value').value;
                const review_text = reviewForm.querySelector('textarea').value;

                if (rating === '0') {
                    alert('Musisz wybrać ocenę w gwiazdkach!');
                    return;
                }
                try {
                    const response = await fetch(`/movie/${movieId}/review`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ rating, review_text })
                    });
                    if(!response.ok) throw new Error("Błąd zapisu recenzji.");
                    await openModalForMovie(movieId);
                } catch (error) {
                    console.error("Błąd wysyłania recenzji:", error);
                }
            });
        }

        modal.querySelectorAll('.action-form').forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const action = form.dataset.action;
                const statusInput = form.querySelector('input[name="status"]');
                const body = statusInput ? JSON.stringify({ status: statusInput.value }) : null;

                try {
                    const response = await fetch(action, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: body
                    });
                    if (!response.ok) throw new Error('Błąd zmiany statusu.');
                    await openModalForMovie(movieId);
                } catch (error) {
                    console.error('Błąd formularza akcji:', error);
                }
            });
        });
    }
});