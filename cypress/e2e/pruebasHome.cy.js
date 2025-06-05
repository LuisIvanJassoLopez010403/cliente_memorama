describe('Dado que el usuario accede a la ventana de Home', () => {
    beforeEach(() => {
        cy.visit('http://localhost:4173');
    });

    it('Deberá mostrar el título de la aplicación, instrucciones e input para escribir nombre de usuario', () => {
        cy.get('img').should('exist');
        cy.contains('h2', '¿Eres el mejor maestro Pokémon del mundo?').should('exist');
        cy.contains('h3', '¡Encuentra todos los pokémons ocultos y demuéstralo!').should('exist');
        cy.contains('h1', 'Instrucciones:').should('exist');
        cy.contains('p', 'Da click en un pokémon para revelar qué hay detrás de Ditto, y encuentra todos los pares.').should('exist');
        cy.contains('label', 'Nombre de usuario:').should('exist');
        cy.wait(1500);
    });

    it('Deberá mostrar los botones de regiones al ingresar un nombre de usuario', () => {
        cy.get('input[type="text"]').type('Ash');
        cy.wait(1500);
        cy.contains('h2', 'Selecciona una Región').should('exist');
        cy.get('.button-group button').contains('Kanto').should('exist');
        cy.get('.button-group button').contains('Johto').should('exist');
        cy.get('.button-group button').contains('Sinnoh').should('exist');
        cy.get('.button-group button').contains('Unova').should('exist');
        cy.get('.button-group button').contains('Kalos').should('exist');
        cy.get('.button-group button').contains('Alola').should('exist');
        cy.get('.button-group button').contains('Galar').should('exist');
        cy.get('.button-group button').contains('Paldea').should('exist');
    });

    it('Deberá mostrar los botones de dificultad al ingresar un nombre de usuario y al haber seleccionado región', () => {
        cy.get('input[type="text"]').type('Ash');
        cy.wait(1500);
        cy.contains('h2', 'Selecciona una Región').should('exist');
        cy.get('.button-group button').contains('Kanto').should('exist');
        cy.get('.button-group button').contains('Johto').should('exist');
        cy.get('.button-group button').contains('Sinnoh').should('exist');
        cy.get('.button-group button').contains('Unova').should('exist');
        cy.get('.button-group button').contains('Kalos').should('exist');
        cy.get('.button-group button').contains('Alola').should('exist');
        cy.get('.button-group button').contains('Galar').should('exist');
        cy.get('.button-group button').contains('Paldea').should('exist');  
        cy.get('.button-group button').contains('Kanto').click();
        cy.wait(1500);
        cy.contains('h2', 'Selecciona Dificultad').should('exist');
        cy.get('.button-group button').contains('Facil').should('exist');
        cy.get('.button-group button').contains('Medio').should('exist');
        cy.get('.button-group button').contains('Dificil').should('exist');
    });

   it('Deberá mostrar el botón de comenzar juego al dar ingresar un nombre de usuario y al haber seleccionado región y dificultad', () => {
        cy.get('input[type="text"]').type('Ash');
        cy.wait(1500);
        cy.contains('h2', 'Selecciona una Región').should('exist');  
        cy.get('.button-group button').contains('Kanto').should('exist');
        cy.get('.button-group button').contains('Johto').should('exist');
        cy.get('.button-group button').contains('Sinnoh').should('exist');
        cy.get('.button-group button').contains('Unova').should('exist');
        cy.get('.button-group button').contains('Kalos').should('exist');
        cy.get('.button-group button').contains('Alola').should('exist');
        cy.get('.button-group button').contains('Galar').should('exist');
        cy.get('.button-group button').contains('Paldea').should('exist');  
        cy.get('.button-group button').contains('Kanto').click();
        cy.wait(1500);
        cy.contains('h2', 'Selecciona Dificultad').should('exist');
        cy.get('.button-group button').contains('Facil').should('exist');
        cy.get('.button-group button').contains('Medio').should('exist');
        cy.get('.button-group button').contains('Dificil').should('exist');
        cy.get('.button-group button').contains('Facil').click();
        cy.wait(1500);
        cy.get('.start-button').should('exist');
    });

    it('Deberá ocultar los botones de región, dificultad y comenzar juego al borrar el nombre de usuario', () => {
        cy.get('input[type="text"]').type('Ash');
        cy.wait(1500);
        cy.contains('h2', 'Selecciona una Región').should('exist');  
        cy.get('.button-group button').contains('Kanto').should('exist');
        cy.get('.button-group button').contains('Johto').should('exist');
        cy.get('.button-group button').contains('Sinnoh').should('exist');
        cy.get('.button-group button').contains('Unova').should('exist');
        cy.get('.button-group button').contains('Kalos').should('exist');
        cy.get('.button-group button').contains('Alola').should('exist');
        cy.get('.button-group button').contains('Galar').should('exist');
        cy.get('.button-group button').contains('Paldea').should('exist');  
        cy.get('.button-group button').contains('Kanto').click();
        cy.wait(1500);
        cy.contains('h2', 'Selecciona Dificultad').should('exist');
        cy.get('.button-group button').contains('Facil').should('exist');
        cy.get('.button-group button').contains('Medio').should('exist');
        cy.get('.button-group button').contains('Dificil').should('exist');
        cy.get('.button-group button').contains('Facil').click();
        cy.get('.start-button').should('exist');

        cy.get('input[type="text"]').clear();
        cy.wait(1500);

        cy.contains('h2', 'Selecciona una Región').should('not.exist');  
        cy.contains('.button-group button','Kanto').should('not.exist');
        cy.contains('.button-group button','Johto').should('not.exist');
        cy.contains('.button-group button','Sinnoh').should('not.exist');
        cy.contains('.button-group button','Unova').should('not.exist');
        cy.contains('.button-group button','Kalos').should('not.exist');
        cy.contains('.button-group button','Alola').should('not.exist');
        cy.contains('.button-group button','Galar').should('not.exist');
        cy.contains('.button-group button','Paldea').should('not.exist');  
        cy.contains('h2', 'Selecciona Dificultad').should('not.exist');
        cy.contains('.button-group button','Facil').should('not.exist');
        cy.contains('.button-group button','Medio').should('not.exist');
        cy.contains('.button-group button','Dificil').should('not.exist');
        cy.contains('.start-button').should('not.exist');
    });

    it('Deberá redirigir a la pantalla de juego al dar clic en botón de comenzar juego', () => {
        cy.get('input[type="text"]').type('Ash');
        cy.wait(1500);
        cy.contains('h2', 'Selecciona una Región').should('exist');  
        cy.get('.button-group button').contains('Kanto').should('exist');
        cy.get('.button-group button').contains('Johto').should('exist');
        cy.get('.button-group button').contains('Sinnoh').should('exist');
        cy.get('.button-group button').contains('Unova').should('exist');
        cy.get('.button-group button').contains('Kalos').should('exist');
        cy.get('.button-group button').contains('Alola').should('exist');
        cy.get('.button-group button').contains('Galar').should('exist');
        cy.get('.button-group button').contains('Paldea').should('exist');  
        cy.get('.button-group button').contains('Kanto').click();
        cy.wait(1500);
        cy.contains('h2', 'Selecciona Dificultad').should('exist');
        cy.get('.button-group button').contains('Facil').should('exist');
        cy.get('.button-group button').contains('Medio').should('exist');
        cy.get('.button-group button').contains('Dificil').should('exist');
        cy.get('.button-group button').contains('Facil').click();
        cy.wait(1500);
        cy.get('.start-button').should('exist');
        cy.get('.start-button').click();
        cy.url().should('include', '/game');
    });
});
