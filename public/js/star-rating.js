document.addEventListener('DOMContentLoaded', () => {
    const movieCards = document.querySelectorAll('.movie-card');

    movieCards.forEach(card => {
        const starWidget = card.querySelector('.star-rating-widget');
        const editButton = card.querySelector('.edit-rating-btn');
        const form = card.querySelector('.update-form');
        const summary = card.querySelector('.rating-summary');

        if (editButton) {
            editButton.addEventListener('click', () => {
                form.style.display = 'block';
                summary.style.display = 'none';
            });
        }
        
        if (!starWidget) return;

        const stars = starWidget.querySelectorAll('.star');
        const ratingInput = form.querySelector('.rating-value');
        const ratingDisplay = form.querySelector('.rating-display-value');

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
    });
});