document.addEventListener('DOMContentLoaded', () => {
    const screens = document.querySelectorAll('.screen');
    const starGroups = document.querySelectorAll('.star-group');
    const starRatingArea = document.getElementById('star-rating-area');
    const continueButtons = document.querySelectorAll('.continue-button');
    const progressBar = document.getElementById('progress-bar');
    const messageContainer = document.getElementById('message-container');

    let userRating = 0;

    // --- Core Functions ---
    const goToScreen = (screenId) => {
        screens.forEach(screen => screen.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    };

    const updateProgressBar = (step, totalSteps = 3) => {
        progressBar.textContent = `Step ${step} of ${totalSteps}`;
        progressBar.className = 'progress-bar'; // Reset classes
        if (step > 1) {
            progressBar.classList.add(`step-${step}`);
        }
    };

    // --- Typing Animation Functions ---
    const showTypingIndicator = () => {
        messageContainer.innerHTML = `
            <div class="typing-indicator">
                <span class="dot"></span><span class="dot"></span><span class="dot"></span>
            </div>`;
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
                setTimeout(() => {
                    const cursor = p.querySelector('.cursor');
                    if(cursor) cursor.classList.add('hidden');
                    if (onComplete) onComplete();
                }, 500); // Wait half a second before hiding cursor and firing callback
            }
        }, 50); // Speed of typing
    };


    // --- Event Listeners ---
    starGroups.forEach(group => {
        group.addEventListener('mouseover', () => {
            const rating = parseInt(group.dataset.rating);
            starGroups.forEach(g => {
                const gRating = parseInt(g.dataset.rating);
                const star = g.querySelector('.star');
                g.classList.toggle('hovered', gRating <= rating);
                star.textContent = gRating <= rating ? '★' : '☆';
            });
        });

        group.addEventListener('mouseout', () => {
            starGroups.forEach(g => {
                g.classList.remove('hovered');
                g.querySelector('.star').textContent = '☆';
            });
        });

        group.addEventListener('click', () => {
            userRating = parseInt(group.dataset.rating);
            setTimeout(() => {
                if (userRating >= 4) {
                    goToScreen('screen-2-positive');
                } else {
                    goToScreen('screen-2-negative');
                }
                updateProgressBar(2);
            }, 300);
        });
    });

    continueButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (userRating >= 4) {
                goToScreen('screen-3-positive');
            } else {
                goToScreen('screen-3-negative');
            }
            updateProgressBar(3);
        });
    });

    // --- Initial Pathway Flow ---
    const startConciergeFlow = () => {
        goToScreen('screen-1');
        updateProgressBar(1);
        showTypingIndicator();

        // 1. Simulate "thinking"
        setTimeout(() => {
            // 2. Start typing the message
            const welcomeMessage = "Hi! I'm Alex, your digital concierge. Your feedback helps us improve.";
            typeMessage(welcomeMessage, () => {
                // 3. Reveal the star rating after typing is complete
                starRatingArea.classList.remove('hidden');
            });
        }, 1500); // Wait 1.5s before typing
    };

    startConciergeFlow();
});
