const boxes = document.querySelectorAll(".box");
const gameInfo = document.querySelector(".game-info");
const newGameBtn = document.querySelector(".btn");

let currentPlayer;
let gameGrid;

const winningPositions = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]

// LET'S CREATE FUNCTION TO INTITIALISE THE GAME
function initGame () {
    currentPlayer = "X";
    gameGrid = ["","","","","","","","",""];

    // BOXES SHOULD BE EMPTY
    boxes.forEach((box, index) => {
        box.innerText = "";
        boxes[index].style.pointerEvents = "all";
        // initalize all boxes with css properties again
        box.classList = `box box${index+1}`;
    })

    newGameBtn.classList.remove("active");
    gameInfo.innerText =  `Current Player - ${currentPlayer}`;
}

initGame();

function swapTurn() {
    if (currentPlayer === "X") {
        currentPlayer = "O";
    } else {
        currentPlayer = "X";
    }

    // UI CHANGE
    gameInfo.innerText = `Current Player - ${currentPlayer}`; 
}

function checkGameOver() {
    let answer = "";

    winningPositions.forEach((position) => {
        // ALL 3 BOXES SHOULD BE NON EMPTY AND EXACTLY SAME IN VALUE
        if ((gameGrid[position[0]] !== "" || gameGrid[position[1]] !== "" || gameGrid[position[2]] !== "" )
        && (gameGrid[position[0]] === gameGrid[position[1]]) && (gameGrid[position[1]] === gameGrid[position[2]])) {
            
            // CHECK IF THE WINNER IS X OR O
            if(gameGrid[position[0]] === "X") {
                answer = "X";
            } else {
                answer = "O";
            }

            // DISABLE POINTER EVENTS SINCE WE GOT A WINNER
            boxes.forEach((box) => {
                box.style.pointerEvents = "none";
            });

            // NOW WE KNOW THE WINNER
            boxes[position[0]].classList.add("win");
            boxes[position[1]].classList.add("win");
            boxes[position[2]].classList.add("win");
        }
    });

    if (answer !== "") {
        gameInfo.innerText = `Winner Player - ${answer}`;
        newGameBtn.classList.add("active");
        return;
    }

    // LETS CHECK WHETHER IT IS A TIE
    let fillCount = 0;
    gameGrid.forEach((box) => {
        if (box !== "") {
            fillCount++;
        }
    });

    if (fillCount === 9) {
        gameInfo.innerText = "Game Tied!"
        newGameBtn.classList.add("active");
    }

}

function handleClick(index) {
    if (gameGrid[index] === "") {
        boxes[index].innerText = currentPlayer;
        gameGrid[index] = currentPlayer;
        boxes[index].style.pointerEvents = "none";

        // SWAP THE TURN
        swapTurn();

        // CHECK WHETHER SOMEONW WON
        checkGameOver();
    }
}

boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
        handleClick(index);
    })
});

newGameBtn.addEventListener("click", initGame)