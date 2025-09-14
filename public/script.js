document.addEventListener('DOMContentLoaded', () => {
    const screens = document.querySelectorAll('.screen');
    const starGroups = document.querySelectorAll('.star-group');
    const continueButtons = document.querySelectorAll('.continue-button');
    const progressBar = document.getElementById('progress-bar');

    let userRating = 0;

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

    // --- Step 1: Handle Star Rating ---
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
            // Wait for animation before switching screen
            setTimeout(() => {
                if (userRating >= 4) { // Positive Path
                    goToScreen('screen-2-positive');
                } else { // Negative or Neutral Path
                    goToScreen('screen-2-negative');
                }
                updateProgressBar(2);
            }, 300);
        });
    });

    // --- Step 2: Handle Continue Button ---
    continueButtons.forEach(button => {
        button.addEventListener('click', () => {
            // In a real app, you would get the text from the textarea here
            // const feedbackText = button.previousElementSibling.value;
            // console.log("Feedback text:", feedbackText);

            if (userRating >= 4) { // Positive Path
                goToScreen('screen-3-positive');
            } else { // Negative or Neutral Path
                goToScreen('screen-3-negative');
            }
            updateProgressBar(3);
        });
    });

    // --- Initial State ---
    goToScreen('screen-1');
    updateProgressBar(1);
});
