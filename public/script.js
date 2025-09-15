document.addEventListener('DOMContentLoaded', () => {
    const screens = document.querySelectorAll('.screen');
    const stars = document.querySelectorAll('.star');
    const starRatingArea = document.getElementById('star-rating-area');
    const messageElement = document.getElementById('concierge-message');

    let userRating = 0;

    const goToScreen = (screenId) => {
        screens.forEach(screen => screen.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
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
                setTimeout(typeWord, 150); // Delay between each word
            } else {
                element.innerHTML = text; // Typing finished, remove cursor
                if (onComplete) onComplete();
            }
        };
        typeWord();
    };

    // --- Star Rating Logic ---
    stars.forEach(star => {
        star.addEventListener('mouseover', () => {
            const hoverValue = parseInt(star.dataset.value);
            stars.forEach(s => {
                s.classList.toggle('hovered', parseInt(s.dataset.value) <= hoverValue);
            });
        });

        star.addEventListener('mouseout', () => stars.forEach(s => s.classList.remove('hovered')));

        star.addEventListener('click', () => {
            userRating = parseInt(star.dataset.value);
            stars.forEach(s => {
                s.classList.toggle('selected', parseInt(s.dataset.value) <= userRating);
            });
            // In a real app you would now move to the next screen
            // Example: setTimeout(() => goToScreen('screen-2'), 400);
        });
    });

    // --- Initial Pathway Flow ---
    const startConciergeFlow = () => {
        goToScreen('screen-1');

        const welcomeMessage = "Hi! I'm Alex, your digital concierge. Your feedback helps us improve.";

        // Start typing after a brief delay
        setTimeout(() => {
            typeMessageWordByWord(messageElement, welcomeMessage, () => {
                // Reveal the star rating after typing is complete
                starRatingArea.classList.remove('hidden');
            });
        }, 500);
    };

    startConciergeFlow();
});
