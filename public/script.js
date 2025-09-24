document.addEventListener('DOMContentLoaded', () => {
    const screens = document.querySelectorAll('.screen');
    const stars = document.querySelectorAll('.star');
    const starRatingArea = document.getElementById('star-rating-area');
    const messageElement = document.getElementById('concierge-message');
    // CORRECTED: Select the new button class
    const continueButtons = document.querySelectorAll('.continue-button-2');

    let userRating = 0;

    const goToScreen = (screenId) => {
        screens.forEach(screen => screen.classList.remove('active'));
        const nextScreen = document.getElementById(screenId);
        if (nextScreen) {
            nextScreen.classList.add('active');
        }
    };

    const typeMessageWordByWord = (element, text, onComplete) => {
        const words = text.split(' ');
        let wordIndex = 0;
        element.innerHTML = '<span class="cursor"></span>';
        const typeWord = () => {
            if (wordIndex < words.length) {
                element.innerHTML = words.slice(0, wordIndex + 1).join(' ') + ' <span class="cursor"></span>';
                wordIndex++;
                setTimeout(typeWord, 150);
            } else {
                element.innerHTML = text;
                if (onComplete) onComplete();
            }
        };
        typeWord();
    };

    const updateStars = (rating) => {
        stars.forEach(star => {
            const starValue = parseInt(star.dataset.value);
            star.classList.toggle('hovered', starValue <= rating);
            star.textContent = starValue <= rating ? '★' : '☆';
        });
    };

    stars.forEach(star => {
        star.addEventListener('mouseover', () => {
            updateStars(parseInt(star.dataset.value));
        });
        star.addEventListener('mouseout', () => {
            updateStars(userRating);
        });
        star.addEventListener('click', () => {
            userRating = parseInt(star.dataset.value);
            updateStars(userRating);
            setTimeout(() => {
                if (userRating >= 4) {
                    goToScreen('screen-2-positive');
                } else {
                    goToScreen('screen-2-negative');
                }
            }, 400);
        });
    });

    // This now correctly finds the new buttons
    continueButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (userRating >= 4) {
                goToScreen('screen-3-positive');
            } else {
                goToScreen('screen-3-negative');
            }
        });
    });

    const startConciergeFlow = () => {
        goToScreen('screen-1');
        const welcomeMessage = "Hi! I'm Alex, your digital concierge. Your feedback helps us improve.";
        setTimeout(() => {
            typeMessageWordByWord(messageElement, welcomeMessage, () => {
                starRatingArea.classList.remove('hidden');
            });
        }, 500);
    };

    startConciergeFlow();
});
