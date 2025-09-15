document.addEventListener('DOMContentLoaded', () => {
    const cards = [
        { id: 'udl-rep', name: 'UDL: Multiple Means of Representation', type: 'udl', description: 'Presenting information and content in different ways to meet the needs of all learners.', questionId: 1 },
        { id: 'udl-eng', name: 'UDL: Multiple Means of Engagement', type: 'udl', description: 'Stimulating interest and motivation for learning.', questionId: 2 },
        { id: 'udl-exp', name: 'UDL: Multiple Means of Action & Expression', type: 'udl', description: 'Offering different ways for students to express what they know.', questionId: 3 },
        { id: 'di-con', name: 'DI: Differentiating Content', type: 'di', description: 'Varying what students learn and the materials they use.', questionId: 1 },
        { id: 'di-pro', name: 'DI: Differentiating Process', type: 'di', description: 'Providing varied activities so students can make sense of content.', questionId: 2 },
        { id: 'di-prod', name: 'DI: Differentiating Product', type: 'di', description: 'Offering various ways for students to demonstrate their understanding.', questionId: 3 }
    ];

    const cardContainer = document.getElementById('card-container');
    const dropZones = document.querySelectorAll('.drop-zone');
    const checkBtn = document.getElementById('check-btn');
    const playAgainBtn = document.getElementById('play-again-btn');
    const scoreDisplay = document.getElementById('score-display');
    const feedbackMessage = document.getElementById('feedback-message');

    let draggedItem = null;

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function createCards() {
        shuffle(cards);
        cardContainer.innerHTML = '';
        cards.forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.className = 'card';
            cardEl.setAttribute('draggable', true);
            cardEl.dataset.cardId = card.id;

            const cardFront = document.createElement('div');
            cardFront.className = 'card-content card-front';
            cardFront.textContent = card.name;

            const cardBack = document.createElement('div');
            cardBack.className = 'card-content card-back';
            cardBack.textContent = card.description;

            cardEl.appendChild(cardFront);
            cardEl.appendChild(cardBack);
            cardContainer.appendChild(cardEl);

            cardEl.addEventListener('click', () => {
                cardEl.classList.toggle('flipped');
            });
        });
        addDragListeners();
    }

    function addDragListeners() {
        const draggableCards = document.querySelectorAll('.card');
        draggableCards.forEach(card => {
            card.addEventListener('dragstart', (e) => {
                draggedItem = card;
                setTimeout(() => {
                    card.classList.add('dragged');
                }, 0);
            });

            card.addEventListener('dragend', () => {
                setTimeout(() => {
                    if (draggedItem) {
                        draggedItem.classList.remove('dragged');
                        draggedItem = null;
                    }
                }, 0);
            });
        });

        dropZones.forEach(zone => {
            let droppedCardsContainer = zone.querySelector('.dropped-cards-container');
            if (!droppedCardsContainer) {
                droppedCardsContainer = document.createElement('div');
                droppedCardsContainer.className = 'dropped-cards-container';
                zone.appendChild(droppedCardsContainer);
            }

            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('drag-over');
            });

            zone.addEventListener('dragleave', () => {
                zone.classList.remove('drag-over');
            });

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');

                if (draggedItem) {
                    const droppedCards = droppedCardsContainer.querySelectorAll('.dropped-card');
                    const newCardType = cards.find(c => c.id === draggedItem.dataset.cardId).type;
                    const existingTypes = Array.from(droppedCards).map(card => cards.find(c => c.id === card.dataset.cardId).type);
                    
                    if (droppedCards.length < 2 && !existingTypes.includes(newCardType)) {
                        const droppedCard = draggedItem.cloneNode(true);
                        droppedCard.classList.remove('dragged');
                        droppedCard.classList.add('dropped-card');
                        droppedCard.setAttribute('draggable', false);
                        droppedCardsContainer.appendChild(droppedCard);
                        draggedItem.remove();
                    }
                }
            });
        });
    }

    function checkAnswers() {
        let score = 0;
        let incorrectCount = 0;
        const totalPossibleMatches = 3;

        dropZones.forEach(zone => {
            zone.classList.remove('incorrect'); // Reset previous feedback
            const droppedCards = Array.from(zone.querySelectorAll('.dropped-card'));
            
            if (droppedCards.length === 2) {
                const questionId = parseInt(zone.dataset.questionId);
                const card1 = cards.find(c => c.id === droppedCards[0].dataset.cardId);
                const card2 = cards.find(c => c.id === droppedCards[1].dataset.cardId);
                
                if (card1 && card2 && card1.questionId === questionId && card2.questionId === questionId && card1.type !== card2.type) {
                    score++;
                } else {
                    zone.classList.add('incorrect');
                    incorrectCount++;
                }
            } else {
                zone.classList.add('incorrect');
                incorrectCount++;
            }
        });
        
        scoreDisplay.textContent = `Score: ${score} / ${totalPossibleMatches}`;
        if (incorrectCount === 0) {
            feedbackMessage.textContent = "All answers are correct! Great job!";
            feedbackMessage.style.color = "#4CAF50";
        } else {
            feedbackMessage.textContent = `You have ${incorrectCount} incorrect match(es).`;
            feedbackMessage.style.color = "#d9534f";
        }
    }

    function resetGame() {
        scoreDisplay.textContent = "";
        feedbackMessage.textContent = "";
        
        dropZones.forEach(zone => {
            zone.classList.remove('incorrect');
            const droppedCards = zone.querySelectorAll('.dropped-card');
            droppedCards.forEach(card => card.remove());
        });

        createCards();
    }

    checkBtn.addEventListener('click', checkAnswers);
    playAgainBtn.addEventListener('click', resetGame);

    // Initial game setup
    createCards();
});