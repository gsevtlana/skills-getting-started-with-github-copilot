class FlashcardApp {
    constructor() {
        this.cards = JSON.parse(localStorage.getItem('flashcards')) || [];
        this.currentCard = null;
        this.currentCardIndex = 0;
        this.reviewCards = [];
        this.streak = 0;
        this.todayReviewed = 0;
        this.initializeEventListeners();
        this.showSection('study');
        this.updateStats();
        this.loadReviewCards();
    }

    initializeEventListeners() {
        // Navigation
        document.getElementById('study-btn').addEventListener('click', () => this.showSection('study'));
        document.getElementById('manage-btn').addEventListener('click', () => this.showSection('manage'));
        document.getElementById('stats-btn').addEventListener('click', () => this.showSection('stats'));

        // Study controls
        document.getElementById('start-review-btn').addEventListener('click', () => this.startReview());
        document.getElementById('show-answer-btn').addEventListener('click', () => this.showAnswer());
        document.getElementById('again-btn').addEventListener('click', () => this.rateDifficulty('again'));
        document.getElementById('good-btn').addEventListener('click', () => this.rateDifficulty('good'));
        document.getElementById('easy-btn').addEventListener('click', () => this.rateDifficulty('easy'));

        // Card management
        document.getElementById('add-card-btn').addEventListener('click', () => this.addCard());

        // Enter key support for form
        document.getElementById('question-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) this.addCard();
        });
        document.getElementById('answer-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) this.addCard();
        });
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Remove active class from nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected section
        document.getElementById(`${sectionName}-section`).classList.add('active');
        document.getElementById(`${sectionName}-btn`).classList.add('active');

        // Update data when switching sections
        if (sectionName === 'manage') {
            this.displayCards();
        } else if (sectionName === 'stats') {
            this.updateStats();
        } else if (sectionName === 'study') {
            this.loadReviewCards();
        }
    }

    addCard() {
        const question = document.getElementById('question-input').value.trim();
        const answer = document.getElementById('answer-input').value.trim();

        if (!question || !answer) {
            alert('Please fill in both question and answer fields.');
            return;
        }

        const card = {
            id: Date.now(),
            question: question,
            answer: answer,
            interval: 1,
            repetition: 0,
            efactor: 2.5,
            nextReview: new Date().toDateString(),
            created: new Date().toDateString()
        };

        this.cards.push(card);
        this.saveCards();
        
        // Clear form
        document.getElementById('question-input').value = '';
        document.getElementById('answer-input').value = '';
        
        this.displayCards();
        this.updateStats();
        alert('Card added successfully!');
    }

    deleteCard(cardId) {
        if (confirm('Are you sure you want to delete this card?')) {
            this.cards = this.cards.filter(card => card.id !== cardId);
            this.saveCards();
            this.displayCards();
            this.updateStats();
        }
    }

    displayCards() {
        const container = document.getElementById('cards-container');
        
        if (this.cards.length === 0) {
            container.innerHTML = '<p>No cards yet. Add some cards to get started!</p>';
            return;
        }

        container.innerHTML = this.cards.map(card => `
            <div class="card-item">
                <h4>Q: ${card.question}</h4>
                <p><strong>A:</strong> ${card.answer}</p>
                <p><small>Next review: ${card.nextReview} | Interval: ${card.interval} days</small></p>
                <div class="card-actions">
                    <button class="btn danger small" onclick="app.deleteCard(${card.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    loadReviewCards() {
        const today = new Date();
        this.reviewCards = this.cards.filter(card => 
            new Date(card.nextReview) <= today
        );
        
        document.getElementById('cards-due').textContent = this.reviewCards.length;
        
        if (this.reviewCards.length === 0) {
            document.getElementById('question-text').textContent = 
                this.cards.length === 0 ? 
                'No cards available. Add some cards first!' : 
                'No cards due for review today. Great job!';
            document.getElementById('start-review-btn').style.display = 
                this.cards.length === 0 ? 'none' : 'inline-block';
        } else {
            document.getElementById('start-review-btn').style.display = 'inline-block';
        }
    }

    startReview() {
        if (this.reviewCards.length === 0) {
            alert('No cards due for review!');
            return;
        }

        this.currentCardIndex = 0;
        this.showCurrentCard();
        
        document.getElementById('start-review-btn').style.display = 'none';
        document.getElementById('show-answer-btn').style.display = 'inline-block';
    }

    showCurrentCard() {
        if (this.currentCardIndex >= this.reviewCards.length) {
            this.endReview();
            return;
        }

        this.currentCard = this.reviewCards[this.currentCardIndex];
        document.getElementById('question-text').textContent = this.currentCard.question;
        document.getElementById('answer-text').textContent = this.currentCard.answer;
        
        // Reset card flip
        document.getElementById('flashcard').classList.remove('flipped');
        document.getElementById('show-answer-btn').style.display = 'inline-block';
        document.getElementById('difficulty-buttons').style.display = 'none';
    }

    showAnswer() {
        document.getElementById('flashcard').classList.add('flipped');
        document.getElementById('show-answer-btn').style.display = 'none';
        document.getElementById('difficulty-buttons').style.display = 'block';
    }

    rateDifficulty(difficulty) {
        if (!this.currentCard) return;

        // SM-2 Algorithm implementation
        const card = this.currentCard;
        
        if (difficulty === 'again') {
            card.repetition = 0;
            card.interval = 1;
        } else {
            if (card.repetition === 0) {
                card.interval = 1;
            } else if (card.repetition === 1) {
                card.interval = 6;
            } else {
                card.interval = Math.round(card.interval * card.efactor);
            }
            
            card.repetition++;
            
            // Update efactor based on difficulty
            const q = difficulty === 'easy' ? 5 : (difficulty === 'good' ? 4 : 3);
            card.efactor = card.efactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
            
            if (card.efactor < 1.3) {
                card.efactor = 1.3;
            }
        }

        // Set next review date
        const nextReviewDate = new Date();
        nextReviewDate.setDate(nextReviewDate.getDate() + card.interval);
        card.nextReview = nextReviewDate.toDateString();

        // Update statistics
        this.todayReviewed++;
        if (difficulty !== 'again') {
            this.streak++;
        } else {
            this.streak = 0;
        }

        this.saveCards();
        this.nextCard();
    }

    nextCard() {
        this.currentCardIndex++;
        this.showCurrentCard();
        this.updateStats();
        document.getElementById('current-streak').textContent = this.streak;
    }

    endReview() {
        document.getElementById('question-text').textContent = 
            `Review session complete! You reviewed ${this.todayReviewed} cards today.`;
        document.getElementById('flashcard').classList.remove('flipped');
        document.getElementById('difficulty-buttons').style.display = 'none';
        document.getElementById('start-review-btn').style.display = 'inline-block';
        document.getElementById('start-review-btn').textContent = 'Start New Review';
        
        this.loadReviewCards();
        this.updateStats();
    }

    updateStats() {
        document.getElementById('total-cards').textContent = this.cards.length;
        document.getElementById('cards-reviewed').textContent = this.todayReviewed;
        document.getElementById('current-streak').textContent = this.streak;
        
        // Calculate success rate (simplified)
        const successfulCards = this.cards.filter(card => card.repetition > 0).length;
        const successRate = this.cards.length > 0 ? 
            Math.round((successfulCards / this.cards.length) * 100) : 0;
        document.getElementById('success-rate').textContent = `${successRate}%`;
        
        // Get longest streak from localStorage
        const longestStreak = localStorage.getItem('longestStreak') || 0;
        if (this.streak > longestStreak) {
            localStorage.setItem('longestStreak', this.streak);
        }
        document.getElementById('longest-streak').textContent = 
            Math.max(longestStreak, this.streak);
    }

    saveCards() {
        localStorage.setItem('flashcards', JSON.stringify(this.cards));
    }

    // Add some sample cards for demo purposes
    addSampleCards() {
        if (this.cards.length === 0) {
            const today = new Date().toDateString();
            const sampleCards = [
                {
                    id: 1,
                    question: "What does HTML stand for?",
                    answer: "HyperText Markup Language",
                    interval: 1,
                    repetition: 0,
                    efactor: 2.5,
                    nextReview: today,
                    created: today
                },
                {
                    id: 2,
                    question: "What is the capital of France?",
                    answer: "Paris",
                    interval: 1,
                    repetition: 0,
                    efactor: 2.5,
                    nextReview: today,
                    created: today
                },
                {
                    id: 3,
                    question: "What is 2 + 2?",
                    answer: "4",
                    interval: 1,
                    repetition: 0,
                    efactor: 2.5,
                    nextReview: today,
                    created: today
                }
            ];
            
            this.cards = sampleCards;
            this.saveCards();
            this.loadReviewCards();
            this.updateStats();
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new FlashcardApp();
    
    // Add sample cards if none exist
    app.addSampleCards();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (document.getElementById('study-section').classList.contains('active')) {
        switch(e.key) {
            case ' ':
                e.preventDefault();
                if (document.getElementById('show-answer-btn').style.display !== 'none') {
                    app.showAnswer();
                }
                break;
            case '1':
                if (document.getElementById('difficulty-buttons').style.display !== 'none') {
                    app.rateDifficulty('again');
                }
                break;
            case '2':
                if (document.getElementById('difficulty-buttons').style.display !== 'none') {
                    app.rateDifficulty('good');
                }
                break;
            case '3':
                if (document.getElementById('difficulty-buttons').style.display !== 'none') {
                    app.rateDifficulty('easy');
                }
                break;
        }
    }
});