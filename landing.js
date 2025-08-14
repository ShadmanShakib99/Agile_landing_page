// landing.js

document.addEventListener('DOMContentLoaded', async function() {
    // --- Elements ---
    const boardContainer = document.getElementById('board-container');
    const todoContainer = document.querySelector('#col-todo .card-container');
    const inProgressContainer = document.querySelector('#col-inprogress .card-container');
    const doneContainer = document.querySelector('#col-done .card-container');
    const cardTemplate = document.getElementById('animated-card-template');

    const fullTitle = "New billing API design";

    // Utility to pause execution
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Main animation loop
    while (true) {
        // 1. Reset and create the card for this cycle
        inProgressContainer.innerHTML = ''; // Clear previous animated card
        const cardFragment = cardTemplate.content.cloneNode(true);
        const animatedCard = cardFragment.querySelector('#animated-card');
        inProgressContainer.prepend(animatedCard);
        
        const titleSpan = animatedCard.querySelector('#animated-title');
        const titleWrapper = animatedCard.querySelector('#animated-title-wrapper');
        
        // Make all cards invisible initially for the fade-in effect
        document.querySelectorAll('.kanban-card').forEach(card => {
            card.classList.remove('fade-in');
            card.style.opacity = 0;
            card.style.visibility = 'hidden';
        });

        // 2. Fade in all cards for a clean start
        document.querySelectorAll('.kanban-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 100}ms`;
            card.classList.add('fade-in');
        });
        await wait(800);

        // 3. Start typing effect
        titleWrapper.classList.add('typing-cursor');
        for (let i = 0; i < fullTitle.length; i++) {
            titleSpan.textContent += fullTitle[i];
            await wait(100); // Typing speed
        }
        titleWrapper.classList.remove('typing-cursor');
        await wait(1500);

        // 4. Move from In Progress -> Done
        await moveCard(animatedCard, doneContainer, 0);
        await wait(2000);
        
        // 5. Move from Done -> To Do
        await moveCard(animatedCard, todoContainer, 1);
        await wait(2000);

        // 6. Move from To Do -> In Progress (back to start)
        await moveCard(animatedCard, inProgressContainer, 0);
        await wait(3000); 
    }

    // Function to smoothly move a card
    function moveCard(card, targetContainer, positionIndex) {
        return new Promise(resolve => {
            const startRect = card.getBoundingClientRect();
            const boardRect = boardContainer.getBoundingClientRect();
            
            card.style.top = `${startRect.top - boardRect.top}px`;
            card.style.left = `${startRect.left - boardRect.left}px`;
            card.style.width = `${startRect.width}px`;
            
            
            boardContainer.appendChild(card);
            card.classList.add('is-moving');

            
            const placeholder = document.createElement('div');
            placeholder.style.height = `${startRect.height}px`;
            placeholder.style.marginBottom = `10px`; // Match the gap
            const targetChildren = Array.from(targetContainer.children);
            targetContainer.insertBefore(placeholder, targetChildren[positionIndex]);
            const endRect = placeholder.getBoundingClientRect();
            
            
            const deltaX = endRect.left - startRect.left;
            const deltaY = endRect.top - startRect.top;

            
            requestAnimationFrame(() => {
                card.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            });
            
            
            card.addEventListener('transitionend', function onMoveEnd() {
                card.removeEventListener('transitionend', onMoveEnd);
                
                // Reset styles for the card
                card.classList.remove('is-moving');
                card.style.position = 'relative';
                card.style.top = '';
                card.style.left = '';
                card.style.width = '';
                card.style.transform = '';
                
                
                targetContainer.replaceChild(card, placeholder);
                
                resolve();
            }, { once: true });
        });
    }
});