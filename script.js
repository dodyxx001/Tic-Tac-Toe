// Game Board module
const gameBoard = (function () {

    let decisions = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];

    const fields = Array.from(document.querySelectorAll('.field'));

    function renderDecisions () {
        for (let i = 0; i <= 8; i++) {
        gameBoard.fields[i].textContent = gameBoard.decisions[i];
        };
    };

    return {
        decisions: decisions,
        fields: fields,
        renderDecisions
    };
})();


// Render-decisions module
// const renderDecisions = (function () {
//     for (let i = 0; i <= 8; i++) {
//         gameBoard.fields[i].textContent = gameBoard.decisions[i];
//     };
// })();


// Creating players - factory function
const Player = (type, symbol) => {
    return {
        type: type,
        symbol: symbol
    };
};


// Choosing the symbol and rendering the players module
const players = (function () {

    // Default : player = X, computer = O
    let player1 = Player('person', 'X');
    let player2 = Player('computer', 'O');

    const buttons = Array.from(document.querySelectorAll('.choice'));
    const buttonx = document.querySelector('#buttonx');
    const buttono = document.querySelector('#buttono');

    // Styling - adding thicker border to chosen option
    function addStyleX () {
        buttonx.classList.add('chosen');
        buttonx.classList.remove('non-chosen');
        buttono.classList.add('non-chosen');
        buttono.classList.remove('chosen');
    }

    function addStyleO () {
        buttono.classList.add('chosen');
        buttono.classList.remove('non-chosen');
        buttonx.classList.add('non-chosen');
        buttonx.classList.remove('chosen');
    }

    buttonx.addEventListener('click', addStyleX);

    buttono.addEventListener('click', addStyleO);

    // Enabling choosing the player
    function choosePlayer () {
        let person = document.getElementsByClassName('chosen')[0].textContent;
        let computer = document.getElementsByClassName('non-chosen')[0].textContent;

        player1.symbol = person;
        player2.symbol = computer;
    }

    // Listen for function above
    buttons.forEach((btn) => {
        btn.addEventListener('click', choosePlayer);
    });

    // When called, disable choosing of 'color'
    function removeChoosingFunctionality () {
        buttons.forEach((btn) => {
            btn.removeEventListener('click', choosePlayer);
            btn.removeEventListener('click', addStyleX);
            btn.removeEventListener('click', addStyleO);
        });
    };

    return {
        player1,
        player2,
        removeChoosingFunctionality
    }
})();


// Game function
const game = (function () { 

    let player1turn = true;  // Switch that iterates between player 1 and 2

    // Function that clicks a random field - COMPUTER PLAY
    const clickRandom = function () {

        let availableFields = gameBoard.fields.filter((ele) => {   // Array of available empty fields
            return ele.textContent === ' ';
        });

        let randomField = availableFields[Math.floor(Math.random() *   // Selects one random empty field
            (             availableFields.length))]
        
        if (availableFields.length > 1){  // Clicks on empty field if there are any
            randomField.click();
        };
    };


    let clickLogic = (e) => {
        if (player1turn) {  // If it's player 1's turn
            let position = gameBoard.fields.indexOf(e.target);
            gameBoard.decisions[position] = players.player1.symbol;
            gameBoard.renderDecisions();
            e.target.classList.add('clicked');
            e.target.removeEventListener('click', clickLogic);  //Disable the clicked field
            players.removeChoosingFunctionality();  // Disable choosing of 'color' when a field is clicked
    
            player1turn = false;  // Enable player 2 turn

            this.setTimeout(function() {           // Play player 2 with delay
                clickRandom()}, 500);
           
        
        } else {
            let position = gameBoard.fields.indexOf(e.target);
            gameBoard.decisions[position] = players.player2.symbol;
            gameBoard.renderDecisions();
            e.target.classList.add('clicked');
            e.target.removeEventListener('click', clickLogic);
            players.removeChoosingFunctionality();
            
            player1turn = true;
        };
    }

    gameBoard.fields.forEach((field) => {
        field.addEventListener('click', clickLogic);
    });

})();




