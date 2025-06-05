describe('Dado que el usuario accede a la ventana de Leaderboard', () => {
    beforeEach(() => {
        cy.visit('http://localhost:4173');
        cy.get('input[type="text"]').type('Ash');
        cy.get('.button-group button').contains('Kanto').click();
        cy.get('.button-group button').contains('Facil').click();
        cy.get('.start-button').click();
        cy.wait(3000);
        cy.revealAllPairs();
        cy.get('.modal-button').click();
    });

    it('Deberá mostrar el título, selectores de dificultad y región y tabla con sus respectivos encabezados', () => {
        cy.contains('🏆 Tabla de Posiciones').should('exist');
        cy.get('.select-group label').contains('Dificultad').should('exist');
        cy.get('.select-group label').contains('Región').should('exist');
        cy.get('.select-group select').contains('Facil').should('exist');
        cy.get('.select-group select').contains('Kanto').should('exist');
        cy.get('table th').contains('Posición').should('exist');
        cy.get('table th').contains('Jugador').should('exist');
        cy.get('table th').contains('Puntaje').should('exist');
    });
    
    it('El selector de dificultad deberá contener las opciones de dificultad', () => {
        cy.get('select').first().within(() => {
            cy.get('option').should('have.length', 3);
            cy.get('option').then(options => {
                const values = [...options].map(o => o.text);
                expect(values).to.include.members(['Facil', 'Medio', 'Dificil']);
            });
        });
    });

    it('El selector de región deberá contener las opciones de regiones', () => {
        cy.get('select').eq(1).within(() => {
            cy.get('option').should('have.length', 9);
            cy.get('option').then(options => {
                const values = [...options].map(o => o.text);
                expect(values).to.include.members(['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unova', 'Kalos', 'Alola', 'Galar', 'Paldea']);
            });
        });
    });

    it('Deberá mostrar máximo 5 puntajes ordenados de menor a mayor', () => {
        cy.get('tbody tr').should('have.length.at.most', 5);

        cy.get('tbody tr td:nth-child(3)').then($cells => {
            const scores = [...$cells].map(cell => parseInt(cell.innerText));
            const sorted = [...scores].sort((a, b) => a - b);
            expect(scores).to.deep.equal(sorted);
        });
    });

    it('Deberá mostrar la mejor partida del jugador actual debajo de la tabla de posiciones', () => {
        cy.get('.player-position').contains('🎉 Tu mejor partida:').should('exist');
        cy.get('.player-position').within(() => {
            cy.contains('Puesto: 1').should('exist');
            cy.contains('Nombre: Ash').should('exist');
            cy.contains('Puntaje: 6').should('exist');
        });
    });

    it('Deberá permitir seleccionar otra dificultad', () => {
        cy.get('select').first().select('Dificil');
        cy.wait(500);
        cy.get('select').first().should('have.value', 'Dificil');
        cy.wait(1000);
    });

    it('Deberá permitir seleccionar otra región', () => {
        cy.get('select').eq(1).select('Johto');
        cy.wait(500);
        cy.get('select').eq(1).should('have.value', 'Johto');
        cy.wait(1000);
    });

    it('Deberá de dejar de mostrar la mejor partida del jugador actual si cambia de dificultad', () => {
        cy.get('.player-position').contains('🎉 Tu mejor partida:').should('exist');
        cy.get('.player-position').within(() => {
            cy.contains('Puesto: 1').should('exist');
            cy.contains('Nombre: Ash').should('exist');
            cy.contains('Puntaje: 6').should('exist');
        });

        cy.get('select').first().select('Dificil');
        cy.wait(500);
        cy.get('select').first().should('have.value', 'Dificil');
        cy.wait(1000);

        cy.get('.player-position').should('not.exist');
    });

    it('Deberá de dejar de mostrar la mejor partida del jugador actual si cambia de región', () => {
        cy.get('.player-position').contains('🎉 Tu mejor partida:').should('exist');
        cy.get('.player-position').within(() => {
            cy.contains('Puesto: 1').should('exist');
            cy.contains('Nombre: Ash').should('exist');
            cy.contains('Puntaje: 6').should('exist');
        });
        
        cy.get('select').eq(1).select('Johto');
        cy.wait(500);
        cy.get('select').eq(1).should('have.value', 'Johto');
        cy.wait(1000);

        cy.get('.player-position').should('not.exist');
    });
});