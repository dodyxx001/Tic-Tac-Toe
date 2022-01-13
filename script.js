
// Game Board module - renders gameboard
const gameBoard = (function () {

    let decisions = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];   // In the beginning, fields are empty

    const fields = Array.from(document.querySelectorAll('.field'));

    function renderDecisions () {       // function that returns the letters from array into the fields
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


// Choosing the symbol and creating the players module
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

// Choosing the difficulty module
const difficulty = (function () {

    let button = document.querySelector('#difficulty');

    function choose () {
        if (button.textContent === 'EASY'){
            button.textContent = 'MEDIUM';
        } else if (button.textContent === 'MEDIUM'){
            button.textContent = 'HARD';
        } else {
            button.textContent = 'EASY'
        };
    };

    button.addEventListener('click', choose);

    function removeChoosingDifficulty () {
        button.removeEventListener('click', choose);
    }

    return {
        removeChoosingDifficulty,
        button
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


// Module that checks for the winner and displays the win screen when an user wins

const showWinDisplay = (function () {
    let display = document.querySelector('.announce');
    let text = document.querySelector('#winner-text');
    let body = document.querySelector('body');
    
    function show () {

        let test = gameEnd.check();

        if (test === 'x wins') {
            display.classList.add('show');
            body.classList.add('bodyBlur');
            text.textContent = 'X WINS!';
        };
        if (test === 'o wins') {
            display.classList.add('show');
            body.classList.add('bodyBlur');
            text.textContent = 'O WINS!';
        };
        if (test === 'draw') {
            display.classList.add('show');
            body.classList.add('bodyBlur');
            text.textContent = 'It\'s a draw!';
        };
    }
    return {
        show
    }
})();




// Module fot computer plays
const cpuPlay = (function () {
    // Returns X or O, depends on which symbol the player chose

    // Function that clicks a random field - COMPUTER PLAY EASY
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

    // Minimax function - AI (COMPUTER PLAY HARD)
    
    const humanPlayer = players.player1.symbol;
    const aiPlayer = players.player2.symbol;
    // const humanPlayer = 'X';
    // const aiPlayer = 'O';

    // minimax's BOARD parameter = gameBoard.fields.
    // player = players.player1.symbol

    function emptyIndexes(board) {  //works - cpuPlay.emptyIndexes(gameBoard.fields), vrne prazne indexe polj
        let arr = [];
        board.forEach((ele) => {
            if (ele.innerHTML === ' ' || ele.innerHTML === ''){
              arr.push(ele.getAttribute('data-n') - 1);
            }
        })
        return arr;
    };

    function winning(board, player){  //works cpuPlay.winning(gameBoard.fields, players.player1.symbol)
        if (
        (board[0].textContent == player && board[1].textContent == player && board[2].innerHTML == player) ||
        (board[3].textContent == player && board[4].textContent == player && board[5].innerHTML == player) ||
        (board[6].textContent == player && board[7].textContent == player && board[8].innerHTML == player) ||
        (board[0].textContent == player && board[3].textContent == player && board[6].innerHTML == player) ||
        (board[1].textContent == player && board[4].textContent == player && board[7].innerHTML == player) ||
        (board[2].textContent == player && board[5].textContent == player && board[8].innerHTML == player) ||
        (board[0].textContent == player && board[4].textContent == player && board[8].innerHTML == player) ||
        (board[2].textContent == player && board[4].textContent == player && board[6].innerHTML == player)
        ) {
        return true;
        } else {
        return false;
        };
    };

    function minimax(newBoard, player){
        // available spots - function above
        let availSpots = emptyIndexes(newBoard);

        // getting scores
        if (winning(newBoard, humanPlayer)){
            return {score:-10};
         }
           else if (winning(newBoard, aiPlayer)){
           return {score:20};
           }
         else if (availSpots.length === 0){
             return {score:0};
        }

        // an array to collect all the objects
        let moves = [];

                // loop through available spots
                for (let i = 0; i < availSpots.length; i++){
                    //create an object for each and store the index of that spot 
            let move = {};
                    move.index = newBoard[availSpots[i]];

                    // set the empty spot to the current player
                    newBoard[availSpots[i]].textContent = player;

                    /*collect the score resulted from calling minimax 
                    on the opponent of the current player*/
                    if (player == aiPlayer){
                    let result = minimax(newBoard, humanPlayer);
                    move.score = result.score;
                    }
                    else{
            let result = minimax(newBoard, aiPlayer);
                    move.score = result.score;
                    }

                    // reset the spot to empty
                    newBoard[availSpots[i]] = move.index;
                    newBoard[availSpots[i]].textContent = ' ';

                    // push the object to the array
                    moves.push(move);
                }
                
        let bestMove;
                if(player === aiPlayer){
            let bestScore = -10000;
                    for (let i = 0; i < moves.length; i++){
                    if(moves[i].score > bestScore){
                        bestScore = moves[i].score;
                        bestMove = i;
                    }
                    }
                    }else{

            // else loop over the moves and choose the move with the lowest score
        let bestScore = 10000;
                for (let i = 0; i < moves.length; i++){
                if(moves[i].score < bestScore){
                    bestScore = moves[i].score;
                    bestMove = i;
                }
                }
            }

            // return the chosen move (object) from the moves array
            return moves[bestMove];
    };

    // When called, clicks the returned field form minimax
    function click () {
        (minimax(gameBoard.fields, players.player2.symbol).index).click()
    };

    return {
        clickRandom,
        click,
        minimax
    };
})();


// Game module - contains functions that enable game-playing
const game = (function () { 

    let player1turn = true;  // Switch that iterates between player 1 and 2

    // Functions that enable clicking of the fields
    // Additional functionality on the click - avoiding repetitions of code
    let clickFunctionality = (e) => {
   
        gameBoard.renderDecisions(); // Renders new, chenged array of fields
        e.target.classList.add('clicked');  
        e.target.removeEventListener('click', clickLogic);  //Disable the clicked field
        players.removeChoosingFunctionality();  // Disable choosing of 'color' when the first field has been clicked
        showWinDisplay.show();  // Checks for the winner 
    }


    let clickLogic = (e) => {
        // 1. PLAYER 1 TURN
        if (player1turn) {  
            let position = gameBoard.fields.indexOf(e.target);  // Finds the number of clicked field
            gameBoard.decisions[position] = players.player1.symbol;  // Changes the array element from empty to player1's symbol

            clickFunctionality(e);  // Calls the additional functionality - defined above

            player1turn = false;  // Enable player 2 turn

            // Getting a click from CPU player
            if (difficulty.button.textContent === 'EASY'){ // Easy difficulty - gets random field      
                    cpuPlay.clickRandom()             
            } else if (difficulty.button.textContent === 'HARD') {  // Hard difficulty - gets AI logic (minimax)          
                    cpuPlay.click()            
            } else {
                    // Medium difficulty - Gives 50% times unbeatable answer, 50% times random answer.
                    let randomizer = Math.floor(Math.random() * 100);
                    console.log(randomizer);
                    if (randomizer < 51){
                        cpuPlay.click();
                    } else {
                        cpuPlay.clickRandom();
                    };  
            };

        // 2. PLYER 2 TURN 
        } else {   
            this.setTimeout(function() {               
                let position = gameBoard.fields.indexOf(e.target);
                gameBoard.decisions[position] = players.player2.symbol;
                
                player1turn = true;

                clickFunctionality(e);
            }, 300);
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
    let playAgainButton = document.querySelector('#play-again');

    restartButton.addEventListener('click', () => {
        reloadPage();
    });

    playAgainButton.addEventListener('click', () => {
        reloadPage();
    });

    return {
        reloadPage
    };
})();


// this.setTimeout(function() { 
// }, 500);
