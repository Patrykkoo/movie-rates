document.addEventListener('DOMContentLoaded', () => {
    const allStarRatings = document.querySelectorAll('.star-rating-widget');

    allStarRatings.forEach(widget => {
        const stars = widget.querySelectorAll('.star');
        const ratingInput = widget.querySelector('.rating-value');
        const ratingDisplay = widget.querySelector('.rating-display');

        const setStars = (rating) => {
            stars.forEach(star => {
                if (parseInt(star.dataset.value) <= rating) {
                    star.classList.add('selected');
                } else {
                    star.classList.remove('selected');
                }
            });
        };

        stars.forEach(star => {
            star.addEventListener('click', () => {
                const value = star.dataset.value;
                ratingInput.value = value;
                ratingDisplay.textContent = `${value}/10`;
                setStars(value);
            });

            star.addEventListener('mouseover', () => {
                const hoverValue = star.dataset.value;
                stars.forEach(s => {
                    s.classList.toggle('hover', parseInt(s.dataset.value) <= hoverValue);
                });
            });
        });

        widget.addEventListener('mouseout', () => {
            stars.forEach(s => s.classList.remove('hover'));
            setStars(ratingInput.value);
        });

        setStars(ratingInput.value);
    });
});