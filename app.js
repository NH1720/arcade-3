// *******************TEST**********************
const titleElem = document.querySelector("#board");
console.log("board", titleElem);

// Stage 1 - Game State and Rendering
// ******************** STATE ***********************
// Create an initial state
const state = {};

// build initial state which is going to populate our board
function buildInitialState() {
  state.board = [
    { value: "car", isTurned: false },
    { value: "bus", isTurned: false },
    { value: "car", isTurned: false },
    { value: "cat", isTurned: false },
    { value: "dog", isTurned: false },
    { value: "cat", isTurned: false },
    { value: "dog", isTurned: false },
    { value: "hat", isTurned: false },
    { value: "hat", isTurned: false },
    { value: "bus", isTurned: false },
    { value: "mit", isTurned: false },
    { value: "mit", isTurned: false },
  ];

  state.getCurrentPlayer = function () {
    return state.players[state.currentPlayerIdx];
  };
  // empty placeholders for our players we'll store these with the user names
  state.players = ["", ""];
  // we're going to keep track of their indices so we know who's turn it is
  state.currentPlayerIdx = 0;
  // default score is set to 0
  state.scores = [0, 0];
  // If there isn't a last turn, we don't set it to 0 because that's a valid index
  state.lastTurnedIdx = -1;
}

// ***************** DOM SELECTORS *****************
const scoreElem = document.querySelector("#score");
const boardElem = document.querySelector("#board");
const playerTurnElem = document.querySelector("#player-turn");

// ***************** GAME LOGIC HELPER FUNCTIONS *****************
const changeTurn = () => {
  // switch players using thier indices players are stored in an array
  state.currentPlayerIdx = state.currentPlayerIdx === 0 ? 1 : 0;
};

// ***************** DOM MANIPULATION FUNCTIONS *****************

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
    if (card.isTurned) cellElem.innerHTML = card.value;
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
    text = `It's currently <span class="player">${state.getCurrentPlayer()}</span>'s turn`;
  }
  // whatever we've decided the text should be, now set it on the element
  playerTurnElem.innerHTML = text;
}

function renderScore() {
  // displays score
  scoreElem.innerHTML = `
    <div>${state.players[0]}: ${state.scores[0]}</div>
    <div>${state.players[1]}: ${state.scores[1]}</div>
  `;
}

// Render function to call all renders
function render() {
  // calls each of the render functions
  renderScore();
  renderBoard();
  renderPlayer();
}

// ***************** TRIGGERED ON EACH TURN CLICK *****************
function takeTurn(index) {
  // only allow play if we have player names
  if (!state.players[0] || !state.players[1]) {
    return;
  }
  // find our card
  const card = state.board[index];
  // if it's owned or already turned, disallow click
  if (card.isTurned) {
    return;
  }
  // set it to turned, because we've clicked on it
  card.isTurned = true;
  // find the last turned. If lastTurnedIdx is -1 this will be undefined.
  // To prevent errors, we default to empty object if not found
  // we set this to an object because without it lastTurnedIdx is undefined so whenever it is
  // undefined we give it a value of on object
  const lastTurnedCard = state.board[state.lastTurnedIdx] || {};
  // if our cards match
  if (lastTurnedCard.value === card.value) {
    // whoever turned it gets one more point
    state.scores[state.currentPlayerIdx]++;
    // since we've scored and set above, we can now safely say "no card is currently turned"
    state.lastTurnedIdx = -1;
    // reset those that have been turned
  } else if (lastTurnedCard.isTurned) {
    // end of turn if we haven't found a match and we already are "holding" a card
    changeTurn();
  } else {
    // this is the first turn, so we set the last index to this card
    state.lastTurnedIdx = index;
  }
  render();
}

// ***************** EVENT LISTENERS *****************
boardElem.addEventListener("click", function (event) {
  // we've attached the event to the parent elem, but we only want to do something if an actual cell was clicked
  if (event.target.className !== "cell") {
    return;
  }
  // get the index from the data attribute, so we can get that element from our state
  const cellIdx = event.target.dataset.index;
  takeTurn(cellIdx);
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
    render();
  }
});

// ***************** BOOTSTRAPPING *****************
buildInitialState();
render();