document.addEventListener('DOMContentLoaded', () => {
    const screens = document.querySelectorAll('.screen');
    const stars = document.querySelectorAll('.star');
    const starRatingArea = document.getElementById('star-rating-area');

    let userRating = 0;

    const goToScreen = (screenId) => {
        screens.forEach(screen => screen.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    };

    // --- Multi-line Typing Animation ---
    const typeMultiLineMessage = (elementId, lines, onComplete) => {
        const element = document.getElementById(elementId);
        if (!element) return;

        let lineIndex = 0;
        let timeout = 0;

        const typeLine = () => {
            if (lineIndex < lines.length) {
                // Add the next line with a delay
                setTimeout(() => {
                    element.innerHTML += (lineIndex > 0 ? '<br>' : '') + lines[lineIndex];
                    lineIndex++;
                    typeLine();
                }, 300); // Delay between each line appearing
            } else if (onComplete) {
                onComplete();
            }
        };
        typeLine();
    };

    // --- Star Rating Logic ---
    stars.forEach(star => {
        star.addEventListener('mouseover', () => {
            const hoverValue = parseInt(star.dataset.value);
            stars.forEach(s => {
                s.classList.toggle('hovered', parseInt(s.dataset.value) <= hoverValue);
            });
        });

        star.addEventListener('mouseout', () => {
            stars.forEach(s => s.classList.remove('hovered'));
        });

        star.addEventListener('click', () => {
            userRating = parseInt(star.dataset.value);
            stars.forEach(s => {
                s.classList.toggle('selected', parseInt(s.dataset.value) <= userRating);
            });

            // Proceed to the next step after a brief delay
            setTimeout(() => {
                if (userRating >= 4) { // Positive Path
                    goToScreen('screen-2-positive');
                } else { // Negative or Neutral Path
                    goToScreen('screen-2-negative');
                }
            }, 400);
        });
    });

    // --- Initial Pathway Flow ---
    const startConciergeFlow = () => {
        goToScreen('screen-1');

        const welcomeMessageLines = [
            "Hi!", "I'm", "Alex,", "your", "digital", "concierge.",
            "Your", "feedback", "helps", "us", "improve."
        ];

        // Start typing the message, and when it's done, reveal the stars
        typeMultiLineMessage('concierge-message', welcomeMessageLines, () => {
            starRatingArea.classList.remove('hidden');
        });
    };

    startConciergeFlow();
});
