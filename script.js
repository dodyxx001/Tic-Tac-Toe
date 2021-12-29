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

// Module that checks for win and draw status

const gameEnd = (function () {

    let clicked = document.getElementsByClassName('clicked');  // gets all clicked fields - live

    function check () {   // when called, this checks if specific combinations of fields have been clicked

        let textContentArray = Array.from(clicked);  // Array from html collection

        let fields = {   // Creating object with X fields and O fields
            x: [],
            o: [],
            get info () {  // Getter that returns joined numbers of fields
                return [Number(this.x.join('')), Number(this.o.join(''))]
            }
        };

        textContentArray.forEach((ele) => {   // returns numbers of clicked fields
            if (ele.textContent === 'X'){
                fields.x.push(ele.getAttribute('data-n'));
            };
            if (ele.textContent === 'O'){
                fields.o.push(ele.getAttribute('data-n'));
            };
        });

        let values = fields.info;  // getter function from above
        console.log(values)

        let regex = /123|456|789|1.?4.?7|2.?5.?8|3.?6.?9|1.?5.?9|3.?5.?7/g;  //regex to test against

        let result = '';

        if ( regex.test(values[0]) ) {  // this tests against fields.x
            result = 'x wins'
        } else if ( regex.test(values[1]) ) {  // this tests against fields.o
            result = 'o wins'
        } else if ( ( (fields.x.length > 4) || (fields.o.length > 4)) &&  // checks for a draw
                    ( !regex.test(values[0])) &&
                    ( !regex.test(values[1])) ) {
            result = 'draw'
        }

        return result;
    };

    return {
        check
    };   
})()


// Function that checks for the winner and displays the win screen when an user wins

const showWinDisplay = (function () {
    
    function show () {
        let test = gameEnd.check();
        if (test === 'x wins') {console.log('x wins')};
        if (test === 'o wins') {console.log('o wins')};
        if (test === 'draw') {console.log('its a draw')};
    }
    return {
        show
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

    // Functions that enable clicking of the fields
    // Additional functionality on the click - avoiding repetitions of code
    let clickFunctionality = (e) => {
   
        gameBoard.renderDecisions(); // Renders new, chenged array of fields
        e.target.classList.add('clicked');  // Enables styling
        e.target.removeEventListener('click', clickLogic);  //Disable the clicked field
        players.removeChoosingFunctionality();  // Disable choosing of 'color' when the first field has been clicked
        showWinDisplay.show();  // Checks for the winner 
    }


    let clickLogic = (e) => {
        if (player1turn) {  // If it's player 1's turn
            let position = gameBoard.fields.indexOf(e.target);  // Finds the number of clicked field
            gameBoard.decisions[position] = players.player1.symbol;  // Changes the array element from empty to player1's symbol

            clickFunctionality(e);  // Calls the additional functionality - defined above

            player1turn = false;  // Enable player 2 turn

            this.setTimeout(function() {           // Play player 2 with delay
                clickRandom()}, 500);              // clickRandom - defined above
           
        } else {                    // player 2 turn
            let position = gameBoard.fields.indexOf(e.target);
            gameBoard.decisions[position] = players.player2.symbol;
            
            player1turn = true;

            clickFunctionality(e);
        };
    };

    gameBoard.fields.forEach((field) => {
        field.addEventListener('click', clickLogic);
    });

})();


//Adding functionality to 'restart' button - module

const restart = (function () {

    function reloadPage () {
        location.reload();
    }

    let restartButton = document.querySelector('#restart');

    restartButton.addEventListener('click', () => {
        reloadPage();
    });

    return {
        reloadPage
    };
})();



