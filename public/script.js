document.addEventListener('DOMContentLoaded', () => {
    const screens = document.querySelectorAll('.screen');
    const stars = document.querySelectorAll('.star');
    const starRatingArea = document.getElementById('star-rating-area');
    const messageElement = document.getElementById('concierge-message');

    let userRating = 0;

    // --- Function to switch screens ---
    const goToScreen = (screenId) => {
        screens.forEach(screen => screen.classList.remove('active'));
        const nextScreen = document.getElementById(screenId);
        if (nextScreen) {
            nextScreen.classList.add('active');
        }
    };

    // --- Word-by-Word Typing Animation ---
    const typeMessageWordByWord = (element, text, onComplete) => {
        const words = text.split(' ');
        let wordIndex = 0;
        element.innerHTML = '<span class="cursor"></span>'; // Start with a cursor

        const typeWord = () => {
            if (wordIndex < words.length) {
                element.innerHTML = words.slice(0, wordIndex + 1).join(' ') + ' <span class="cursor"></span>';
                wordIndex++;
                setTimeout(typeWord, 150);
            } else {
                element.innerHTML = text; // Typing finished
                if (onComplete) onComplete();
            }
        };
        typeWord();
    };

    // --- Star Rating Logic (with Navigation) ---
    const updateStars = (rating) => {
        stars.forEach(star => {
            const starValue = parseInt(star.dataset.value);
            if (starValue <= rating) {
                star.classList.add('hovered');
                star.textContent = '★'; // Filled star
            } else {
                star.classList.remove('hovered');
                star.textContent = '☆'; // Outline star
            }
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
            
            stars.forEach(s => {
                s.classList.remove('selected');
                if (parseInt(s.dataset.value) <= userRating) {
                    s.classList.add('selected');
                }
            });
            
            updateStars(userRating);

            // THIS IS THE CRITICAL FIX: Navigate to the next screen after a short delay
            setTimeout(() => {
                if (userRating >= 4) {
                    // Go to positive feedback screen
                    goToScreen('screen-2-positive');
                } else {
                    // Go to negative/neutral feedback screen
                    goToScreen('screen-2-negative');
                }
            }, 400); // 400ms delay for a smooth transition
        });
    });


    // --- Initial Pathway Flow ---
    const startConciergeFlow = () => {
        goToScreen('screen-1'); // Ensure we start on the first screen
        const welcomeMessage = "Hi! I'm Alex, your digital concierge. Your feedback helps us improve.";

        setTimeout(() => {
            typeMessageWordByWord(messageElement, welcomeMessage, () => {
                starRatingArea.classList.remove('hidden');
            });
        }, 500);
    };

    startConciergeFlow();
});
