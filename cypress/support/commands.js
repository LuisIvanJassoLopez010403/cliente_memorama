// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


Cypress.Commands.add('revealAllPairs', () => {
    cy.get('.card[data-sprite]').then(cards => {
        const cardsArray = [...cards];
        const pairsMap = new Map();

        cardsArray.forEach(card => {
            const sprite = card.getAttribute('data-sprite');
            if (!pairsMap.has(sprite)) {
                pairsMap.set(sprite, []);
            }
            pairsMap.get(sprite).push(card);
        });

        const revealPairAtIndex = (pairs, index) => {
            if (index >= pairs.length) return;

            const pair = pairs[index];
            const [card1, card2] = pair;

            cy.wrap(card1).click();
            cy.wait(550);
            cy.wrap(card2).click();
            cy.wait(1500);

            revealPairAtIndex(pairs, index + 1);
        };

        const pairs = Array.from(pairsMap.values()).filter(arr => arr.length === 2);
        revealPairAtIndex(pairs, 0);
    });
});
