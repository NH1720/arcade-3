const state = {};

// build initial state which is going to populate our board
function buildInitialState() {
  state.board = [
    null, null, null, 
    null, null, null, 
    null, null, null
  ]
  state.getCurrentPlayer = function () {
    return state.players[state.currentPlayerIdx];
  };
  // empty placeholders for our players we'll store these with the user names
  state.players = ["", ""];
  // we're going to keep track of their indices so we know who's turn it is
  state.currentPlayerIdx = Math.floor(Math.random() * 2);
}

const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7], 
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

let options = ["", "", "", "", "", "", "", "", ""];
let running = false; 
  


const boardElem = document.querySelector("#board");
const playerTurnElem = document.querySelector("#player-turn");


const changeTurn = () => {
  // switch players using thier indices players are stored in an array
  state.currentPlayerIdx = state.currentPlayerIdx === 0 ? 1 : 0;
};

function renderBoard() {
  // this resest our board every time our renderBoard is called we want the updated version
  boardElem.innerHTML = "";
  for (let i = 0; i < state.board.length; ++i) {
    const card = state.board[i];
    // create a cell
    const cellElem = document.createElement("div");
    // add a class so we can style it and target it in the click listener
    cellElem.classList.add("cell");
    // add the word of the current card ONLY if it is turned
    // if (card.isTurned) cellElem.innerHTML = card.value;
    // keep track of the index for future play
    cellElem.dataset.index = i;
    // append the cell
    boardElem.appendChild(cellElem);
  }
}

function renderPlayer() {
  let text;
  // conditionally set text to what we want it to be
  // if we have no players yet, show the inputs
  if (!state.players[0] || !state.players[1]) {
    text = `
      <input name="player1" placeholder="Enter Player 1">
      <input name="player2" placeholder="Enter Player 2">
      <button class="start">Start Game</button>
    `;
  } else {
    // if we do have players
    text = `It's currently <span class="player">${state.getCurrentPlayer()}'s</span> turn <button>Reset</button>
    `;
  }
  // whatever we've decided the text should be, now set it on the element
  playerTurnElem.innerHTML = text;
}


// Render function to call all renders
function render() {
  renderBoard();
  renderPlayer();
}

boardElem.addEventListener("click", function (event) {
  // we've attached the event to the parent elem, but we only want to do something if an actual cell was clicked
  if (event.target.className !== "cell") {
    return;
  }
  // get the index from the data attribute, so we can get that element from our state
  const cellIdx = event.target.dataset.index;
  console.log(cellIdx);

if (state.currentPlayerIdx === 0) {
  state.board[cellIdx] = 'X';
} else {
  state.board[cellIdx] = "O";
}
  changeTurn();
  render();
});

playerTurnElem.addEventListener("click", function (event) {
  // we've attached the event to the parent elem, but we only want to do something if an actual start button was clicked
  if (event.target.className === "start") {
    // get the input element
    const player1Input = document.querySelector("input[name=player1]");
    // get the value from the input
    const player1Value = player1Input.value;
    // set the player name entered on state
    state.players[0] = player1Value;
    const player2Input = document.querySelector("input[name=player2]");
    const player2Value = player2Input.value;
    state.players[1] = player2Value;
    if (!player2Value) {
      state.players[1] = 'the Computer';
    }
    render();
  }
});

buildInitialState();
render();