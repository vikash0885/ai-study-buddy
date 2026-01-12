// AI Study Buddy - Core Application Logic

document.addEventListener('DOMContentLoaded', () => {
    // State
    const state = {
        currentView: 'chat',
        flashcards: [
            { question: "What is the powerhouse of the cell?", answer: "Mitochondria", hint: "Starts with M" },
            { question: "What is the largest planet in our solar system?", answer: "Jupiter", hint: "Gas Giant" },
            { question: "Who wrote 'Romeo and Juliet'?", answer: "William Shakespeare", hint: "The Bard" },
            { question: "What is the chemical symbol for Gold?", answer: "Au", hint: "Aurum" }
        ],
        currentCardIndex: 0
    };

    // DOM Elements
    const views = {
        chat: document.getElementById('chat-view'),
        flashcards: document.getElementById('flashcards-view'),
        quiz: document.getElementById('quiz-view')
    };
    
    const navLinks = document.querySelectorAll('.nav-links li');
    
    // Chat Elements
    const chatInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');

    // Flashcard Elements
    const activeFlashcard = document.getElementById('active-flashcard');
    const cardQuestion = document.getElementById('card-question');
    const cardAnswer = document.getElementById('card-answer');
    const btnFlip = document.getElementById('flip-card');
    const btnPrev = document.getElementById('prev-card');
    const btnNext = document.getElementById('next-card');


    // ---------------------------------------------------------
    // Navigation Logic
    // ---------------------------------------------------------
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            link.classList.add('active');

            // Hide all views
            Object.values(views).forEach(view => {
                view.classList.remove('active');
                setTimeout(() => view.classList.add('hidden'), 300); // Wait for transition
            });

            // Show target view
            const target = link.dataset.tab;
            const targetView = views[target];
            
            targetView.classList.remove('hidden');
            // Small delay to allow display:block to apply before opacity transition
            setTimeout(() => targetView.classList.add('active'), 50);
            
            state.currentView = target;
        });
    });

    // ---------------------------------------------------------
    // Chat Logic
    // ---------------------------------------------------------
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        messageDiv.innerHTML = `
            <div class="message-content ${sender === 'ai' ? 'glass-panel' : ''}">
                <p>${text}</p>
            </div>
            <span class="timestamp">${timestamp}</span>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function generateAIResponse(userText) {
        // Mock AI Logic - In a real app, this would call an API
        const responses = [
            "That's an interesting topic! Let's break it down.",
            "I've added that to your flashcards for review.",
            "Could you elaborate on that?",
            "Here's a quick summary: " + userText.split(' ').slice(0, 5).join(' ') + "..."
        ];

        // Specific Keyword Triggers
        if (userText.match(/hello|hi|hey/i)) return "Hello there! Ready to study?";
        if (userText.match(/thank/i)) return "You're welcome! Keep up the good work.";
        if (userText.match(/explain/i)) return "Sure, explaining concepts is my specialty. What specific part is confusing?";

        return responses[Math.floor(Math.random() * responses.length)];
    }

    function handleSend() {
        const text = chatInput.value.trim();
        if (!text) return;

        // User Message
        addMessage(text, 'user');
        chatInput.value = '';

        // Simulate AI Delay
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message ai typing';
        typingIndicator.innerHTML = '<div class="message-content glass-panel" style="padding:10px">Typing...</div>';
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        setTimeout(() => {
            chatMessages.removeChild(typingIndicator);
            const aiResponse = generateAIResponse(text);
            addMessage(aiResponse, 'ai');
        }, 1500);
    }

    sendBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    // ---------------------------------------------------------
    // Flashcard Logic
    // ---------------------------------------------------------
    function renderCard(index) {
        const card = state.flashcards[index];
        // Reset flip state
        activeFlashcard.classList.remove('flipped');
        
        // Wait for flip to reset before changing content (optional polish)
        setTimeout(() => {
            cardQuestion.innerText = card.question;
            const hintEl = activeFlashcard.querySelector('.hint');
            if (hintEl) hintEl.innerText = `Hint: ${card.hint}`;
            
            cardAnswer.innerText = card.answer;
        }, 200);
    }

    // Initialize first card
    renderCard(state.currentCardIndex);

    activeFlashcard.addEventListener('click', () => {
        activeFlashcard.classList.toggle('flipped');
    });

    btnFlip.addEventListener('click', () => {
        activeFlashcard.classList.toggle('flipped');
    });

    btnNext.addEventListener('click', () => {
        state.currentCardIndex = (state.currentCardIndex + 1) % state.flashcards.length;
        renderCard(state.currentCardIndex);
    });

    btnPrev.addEventListener('click', () => {
        state.currentCardIndex = (state.currentCardIndex - 1 + state.flashcards.length) % state.flashcards.length;
        renderCard(state.currentCardIndex);
    });

});
