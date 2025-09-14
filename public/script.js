document.addEventListener('DOMContentLoaded', () => {
    const chatBody = document.getElementById('chat-body');
    const inputArea = document.getElementById('input-area');
    const progressBar = document.getElementById('progress-bar');

    let userRating = 0;
    let conversationHistory = [];

    const updateProgressBar = (step) => {
        progressBar.textContent = `Step ${step} of 3`;
        progressBar.className = 'progress-bar';
        if (step > 1) progressBar.classList.add(`step-${step}`);
    };

    const addMessage = (htmlContent) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'message-wrapper';
        wrapper.innerHTML = `<div class="bubble">${htmlContent}</div>`;
        chatBody.appendChild(wrapper);
        chatBody.scrollTop = chatBody.scrollHeight;
    };

    const showTypingIndicator = () => {
        const indicator = document.createElement('div');
        indicator.className = 'message-wrapper typing-indicator';
        indicator.innerHTML = `<div class="bubble"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>`;
        chatBody.appendChild(indicator);
        chatBody.scrollTop = chatBody.scrollHeight;
    };

    const removeTypingIndicator = () => {
        const indicator = document.querySelector('.typing-indicator');
        if (indicator) indicator.remove();
    };

    const renderStep = (step) => {
        inputArea.innerHTML = ''; // Clear previous controls
        updateProgressBar(step);

        if (step === 1) {
            addMessage(`<h1>How was your experience today at Café Aroma?</h1>`);
            const starUI = document.createElement('div');
            starUI.className = 'star-rating-container';
            starUI.innerHTML = `
                <div class="star-group" d-rating="1"><span class="star">☆</span><span class="label">Terrible</span></div>
                <div class="star-group" d-rating="2"><span class="star">☆</span><span class="label">Poor</span></div>
                <div class="star-group" d-rating="3"><span class="star">☆</span><span class="label">Okay</span></div>
                <div class="star-group" d-rating="4"><span class="star">☆</span><span class="label">Good</span></div>
                <div class="star-group" d-rating="5"><span class="star">☆</span><span class="label">Excellent</span></div>
            `;
            inputArea.appendChild(starUI);
            attachStarListeners();
        } else if (step === 2) {
            const isPositive = userRating >= 4;
            const prompt = isPositive
                ? `<h1>Fantastic! What made it so great?</h1><p>We love hearing this! Tell us a quick highlight.</p>`
                : `<h1>Oh no! We're so sorry.</h1><p>Your feedback is crucial. Please tell us what went wrong.</p>`;
            addMessage(prompt);

            const textUI = document.createElement('div');
            textUI.innerHTML = `
                <textarea id="feedback-text" class="feedback-textarea" placeholder="Share your feedback here... (optional)"></textarea>
                <button class="continue-button">Continue</button>
            `;
            inputArea.appendChild(textUI);
            document.querySelector('.continue-button').addEventListener('click', () => {
                const feedbackText = document.getElementById('feedback-text').value;
                renderStep(3, feedbackText);
            });
        } else if (step === 3) {
            const feedbackText = arguments[0] || "No additional feedback provided.";
            const userMessageForAI = `Rating: ${userRating} stars. Details: ${feedbackText}`;
            conversationHistory.push({ role: 'user', content: userMessageForAI });
            sendMessageToAI();
        }
    };

    const attachStarListeners = () => {
        const starGroups = document.querySelectorAll('.star-group');
        starGroups.forEach(group => {
            group.addEventListener('mouseover', () => {
                const rating = parseInt(group.getAttribute('d-rating'));
                starGroups.forEach(g => {
                    const gRating = parseInt(g.getAttribute('d-rating'));
                    g.querySelector('.star').textContent = gRating <= rating ? '★' : '☆';
                });
            });
            group.addEventListener('click', () => {
                userRating = parseInt(group.getAttribute('d-rating'));
                setTimeout(() => renderStep(2), 300);
            });
        });
    };

    const sendMessageToAI = async () => {
        inputArea.innerHTML = ''; // Clear input area
        showTypingIndicator();

        try {
            const response = await fetch('/api/concierge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: conversationHistory }),
            });
            if (!response.ok) throw new Error('Network error.');
            const data = await response.json();
            removeTypingIndicator();

            const [heading, paragraph] = data.message.content.split('|');
            addMessage(`<h1>${heading}</h1><p>${paragraph}</p>`);

            // Display final pathway menu
            const isPositive = userRating >= 4;
            const finalMenu = document.createElement('div');
            finalMenu.className = 'pathway-menu';
            finalMenu.innerHTML = isPositive
                ? `<a href="#" class="pathway-option recommended"><div class="icon">G</div><div class="text"><strong>Share on Google</strong><span>Help others discover us.</span></div></a>
                   <a href="#" class="pathway-option"><div class="icon">⭐</div><div class="text"><strong>Give a shout-out</strong><span>Praise a specific team member.</span></div></a>`
                : `<a href="#" class="pathway-option recommended"><div class="icon">💬</div><div class="text"><strong>Request assistance</strong><span>Connect with our support team.</span></div></a>
                   <a href="#" class="pathway-option"><div class="icon">🗓️</div><div class="text"><strong>Schedule a call-back</strong><span>Talk to a manager personally.</span></div></a>`;
            inputArea.appendChild(finalMenu);

        } catch (error) {
            removeTypingIndicator();
            addMessage(`<p>Sorry, I'm having trouble connecting right now. Please try again later.</p>`);
        }
    };

    // Start the conversation
    renderStep(1);
});
