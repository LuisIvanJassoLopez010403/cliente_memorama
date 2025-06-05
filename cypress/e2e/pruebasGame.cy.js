function revealAllPairs() {
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
};

describe('Dado que el usuario accede a la ventana de Game', () => {
    beforeEach(() => {
        cy.visit('http://localhost:4173');
        cy.get('input[type="text"]').type('Ash');
    });

    it('Deberá mostrar el nombre, región y dificultad elegidos', () => {
        cy.get('.button-group button').contains('Kanto').click();
        cy.get('.button-group button').contains('Facil').click();
        cy.wait(5000)
        cy.get('.start-button').click();
        cy.wait(5000)
        cy.contains('Jugador: Ash').should('exist');
        cy.contains('Región: Kanto - Dificultad: Facil - Puntaje: 0').should('exist');
    });
    
    it('Deberá mostrar 12 cartas para la dificultad Fácil', () => {
        cy.get('.button-group button').contains('Kanto').click();
        cy.get('.button-group button').contains('Facil').click();
        cy.wait(5000)
        cy.get('.start-button').click();
        cy.wait(3000)
        cy.get('.grid .card').should('have.length', 12);
    });

    it('Deberá mostrar 20 cartas para la dificultad Medio', () => {
        cy.get('.button-group button').contains('Kanto').click();
        cy.get('.button-group button').contains('Medio').click();
        cy.wait(5000)
        cy.get('.start-button').click();
        cy.wait(3000)
        cy.get('.grid .card').should('have.length', 20);
    });

    it('Deberá mostrar 30 cartas para la dificultad Díficil', () => {
        cy.get('.button-group button').contains('Kanto').click();
        cy.get('.button-group button').contains('Dificil').click();
        cy.wait(5000)
        cy.get('.start-button').click();
        cy.wait(3000)
        cy.get('.grid .card').should('have.length', 30);
    });

    it('Deberá de mostrarse un Ditto en todas las cartas que no han sido reveladas', () => {
        cy.get('.button-group button').contains('Kanto').click();
        cy.get('.button-group button').contains('Facil').click();
        cy.get('.start-button').click();

        cy.wait(3000);

        const dittoSrc = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png';

        cy.get('.card').each(($card) => {
            if (!$card.hasClass('revealed')) {
                cy.wrap($card).find('img').should('have.attr', 'src', dittoSrc);
            }
        });
    });

    it('Deberá aumentar el contador al revelar dos cartas', () => {
        cy.get('.button-group button').contains('Kanto').click();
        cy.get('.button-group button').contains('Facil').click();
        cy.get('.start-button').click();

        cy.get('.grid .card').then(($cards) => {
            cy.wrap($cards[0]).click();
            cy.wrap($cards[1]).click();
        });
        cy.wait(3000)

        cy.contains('Puntaje: 1').should('exist');
    });

    it('Deberá quedarse no revelado un par incorrecto', () => {
        cy.get('.button-group button').contains('Kanto').click();
        cy.get('.button-group button').contains('Facil').click();
        cy.get('.start-button').click();

        cy.wait(3000);

        cy.get('.card[data-sprite]').then(cards => {
            const firstCard = cards[0].getAttribute('data-sprite');
            const secondCard = [...cards].find(card => card.getAttribute('data-sprite') !== firstCard && card !== cards[0]);

            cy.wrap(cards[0]).click();
            cy.wait(1500);
            cy.wrap(secondCard).click();

            cy.wait(1500); 

            cy.wrap(cards[0])
              .should('not.have.class', 'revealed')
              .and('have.css', 'background-color', 'rgb(255, 255, 255)');
            
            cy.wrap(secondCard)
              .should('not.have.class', 'revealed')
              .and('have.css', 'background-color', 'rgb(255, 255, 255)');
        });
    });


    it('Deberá quedarse revelado un par correcto', () => {
        cy.get('.button-group button').contains('Kanto').click();
        cy.get('.button-group button').contains('Facil').click();
        cy.get('.start-button').click();

        cy.wait(3000);

        cy.get('.card[data-sprite]').then(cards => {
            const firstCard = cards[0].getAttribute('data-sprite');
            const secondCard = [...cards].find(card => card.getAttribute('data-sprite') === firstCard && card !== cards[0]);

            cy.wrap(cards[0]).click();
            cy.wait(1500);
            cy.wrap(secondCard).click();

            cy.wait(1500); 

            cy.wrap(cards[0])
              .should('have.class', 'revealed')
              .and('have.css', 'background-color', 'rgb(212, 247, 220)');
            
            cy.wrap(secondCard)
              .should('have.class', 'revealed')
              .and('have.css', 'background-color', 'rgb(212, 247, 220)');
        });
    });

    it('Deberá resolver todo el juego y mostrar la pantalla de victoria', () => {
        cy.get('.button-group button').contains('Kanto').click();
        cy.get('.button-group button').contains('Facil').click();
        cy.get('.start-button').click();

        cy.wait(3000);

        revealAllPairs();

        cy.get('.modal-overlay').should('be.visible');
        cy.get('.modal-title').contains('¡Juego Completado!').should('exist');
        cy.get('.modal-text').contains('Jugador: Ash').should('exist');
        cy.get('.modal-text').contains('Puntaje:').should('exist');
        cy.get('.modal-text').contains('Dificultad: Facil').should('exist');
        cy.get('.modal-button').contains('Ver tabla de posiciones').should('exist');
    });

    it('Deberá redirigir a la pantalla de tabla de posiciones al dar clic en botón de ver tabla de posiciones', () => {
        cy.get('.button-group button').contains('Kanto').click();
        cy.get('.button-group button').contains('Facil').click();
        cy.get('.start-button').click();

        cy.wait(3000);

        revealAllPairs();

        cy.get('.modal-overlay').should('be.visible');
        cy.get('.modal-title').contains('¡Juego Completado!').should('exist');
        cy.get('.modal-text').contains('Jugador: Ash').should('exist');
        cy.get('.modal-text').contains('Puntaje:').should('exist');
        cy.get('.modal-text').contains('Dificultad: Facil').should('exist');
        cy.get('.modal-button').contains('Ver tabla de posiciones').should('exist');
        cy.get('.modal-button').click();
        cy.url().should('include', '/leaderboard');
    });
});