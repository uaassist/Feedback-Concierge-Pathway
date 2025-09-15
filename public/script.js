document.addEventListener('DOMContentLoaded', () => {
    const screens = document.querySelectorAll('.screen');
    const stars = document.querySelectorAll('.star');
    const starRatingArea = document.getElementById('star-rating-area');
    const messageContainer = document.getElementById('message-container');

    let userRating = 0;

    const goToScreen = (screenId) => {
        screens.forEach(screen => screen.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    };

    // --- Typing Animation Functions ---
    const showTypingIndicator = () => {
        messageContainer.innerHTML = `<div class="typing-indicator"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>`;
    };

    const typeMessage = (text, onComplete) => {
        messageContainer.innerHTML = '<p class="typed-text"></p>';
        const p = messageContainer.querySelector('.typed-text');
        p.innerHTML = '<span class="cursor"></span>';
        let i = 0;
        const typingInterval = setInterval(() => {
            p.firstChild.textContent += text.charAt(i);
            i++;
            if (i === text.length) {
                clearInterval(typingInterval);
                if (onComplete) onComplete();
            }
        }, 40); // Speed of typing
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

            setTimeout(() => {
                if (userRating >= 4) {
                    goToScreen('screen-2-positive');
                } else {
                    goToScreen('screen-2-negative');
                }
            }, 400);
        });
    });

    // --- Initial Pathway Flow ---
    const startConciergeFlow = () => {
        goToScreen('screen-1');
        showTypingIndicator();

        // 1. Simulate "thinking"
        setTimeout(() => {
            // 2. Start typing the message
            const welcomeMessage = "Hi! I'm Alex, your digital concierge. Your feedback helps us improve.";
            typeMessage(welcomeMessage, () => {
                // 3. Reveal the star rating after typing is complete
                starRatingArea.classList.remove('hidden');
            });
        }, 1200); // Wait 1.2s before typing
    };

    startConciergeFlow();
});
