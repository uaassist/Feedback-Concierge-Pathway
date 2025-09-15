document.addEventListener('DOMContentLoaded', () => {
    const screens = document.querySelectorAll('.screen');
    const stars = document.querySelectorAll('.star');
    const starRatingArea = document.getElementById('star-rating-area');
    const messageElement = document.getElementById('concierge-message');

    let userRating = 0;

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

    // --- Star Rating Logic (CORRECTED) ---

    // Function to update the visual state of stars based on a rating
    const updateStars = (rating) => {
        stars.forEach(star => {
            const starValue = parseInt(star.dataset.value);
            if (starValue <= rating) {
                star.classList.add('hovered'); // Use 'hovered' for visual consistency
                star.textContent = '★'; // Filled star
            } else {
                star.classList.remove('hovered');
                star.textContent = '☆'; // Outline star
            }
        });
    };

    stars.forEach(star => {
        star.addEventListener('mouseover', () => {
            const hoverValue = parseInt(star.dataset.value);
            updateStars(hoverValue); // Preview the rating on hover
        });

        star.addEventListener('mouseout', () => {
            // When mouse leaves, revert to the actual selected rating
            updateStars(userRating);
        });

        star.addEventListener('click', () => {
            userRating = parseInt(star.dataset.value);
            
            // Permanently set the rating and visual state
            stars.forEach(s => {
                s.classList.remove('selected'); // Clear previous selections first
                if (parseInt(s.dataset.value) <= userRating) {
                    s.classList.add('selected');
                }
            });
            
            updateStars(userRating); // Update visuals to match the new rating

            // In a real app, you would now proceed to the next screen.
            // For example:
            // setTimeout(() => {
            //     if (userRating >= 4) {
            //         // goToScreen('screen-2-positive');
            //     } else {
            //         // goToScreen('screen-2-negative');
            //     }
            // }, 400);
        });
    });


    // --- Initial Pathway Flow ---
    const startConciergeFlow = () => {
        document.getElementById('screen-1').classList.add('active');

        const welcomeMessage = "Hi! I'm Alex, your digital concierge. Your feedback helps us improve.";

        setTimeout(() => {
            typeMessageWordByWord(messageElement, welcomeMessage, () => {
                starRatingArea.classList.remove('hidden');
            });
        }, 500);
    };

    startConciergeFlow();
});
