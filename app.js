const boardElem = document.querySelector("#board");
const playerTurnElem = document.querySelector("#player-turn");


const winMsg = document.querySelector("#win-msg");

const state = {};

function buildInitialState() {
  state.board = [
    "", "", "", 
    "", "", "", 
    "", "", ""
  ]
  state.getCurrentPlayer = function () {
    return state.players[state.currentPlayerIdx];
  };
  state.players = ["", ""];
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

let running = false; 


function checkWinner() {
  let roundWon = false;
  winMsg.innerHTML = "";
  for (let i = 0; i < winConditions.length; i++) {
    const condition = winConditions[i];
    const cellA = state.board[condition[0]];
    const cellB = state.board[condition[1]];
    const cellC = state.board[condition[2]];

    if (cellA === "" || cellB === "" || cellC === "") {
      continue;
    }
    if (cellA === cellB && cellB === cellC) {
      roundWon = true;
      break;
    }
  }
  if (roundWon) {
    winMsg.innerHTML = `${state.getCurrentPlayer()} won!`; 
  } else if (!state.board.includes("")) {
    winMsg.innerHTML = `Draw!`
  }
}


const changeTurn = () => {
  state.currentPlayerIdx = state.currentPlayerIdx === 0 ? 1 : 0;
  if (state.currentPlayerIdx === 1 && state.players[1] === 'the Computer') {
    compGuess();
  }
  render();
};

function renderBoard() {
  boardElem.innerHTML = "";
  for (let i = 0; i < state.board.length; ++i) {
    const cellElem = document.createElement("div");
    cellElem.classList.add("cell");
    cellElem.dataset.index = i;
    cellElem.innerHTML = state.board[i];
    boardElem.appendChild(cellElem);
  }
}


function renderPlayer() {
  let text;
  if (!state.players[0] || !state.players[1]) {
    text = `
      <input name="player1" placeholder="Enter Player 1">
      <input name="player2" placeholder="Enter Player 2">
      <button class="start">Start Game</button>
    `;
  } else {
    text = `It's currently <span class="player">${state.getCurrentPlayer()}'s</span> turn 
    <button class="reset">Reset</button>
    `;
  }
  playerTurnElem.innerHTML = text;
}


function compGuess() {
  for (let i = 0; i < state.board.length; i++) {
    if (state.board[i].length !== 0) {
      continue;
    } else {
      state.board[i] = 'O';
      break;
    }
  }
  changeTurn();
};

function render() {
  renderBoard();
  renderPlayer();
  checkWinner();
}

boardElem.addEventListener("click", function (event) {
  if (winMsg.innerHTML === `${state.getCurrentPlayer()} won!` || winMsg.innerHTML === `Draw!`) {
    return;
  };
  if (state.players[0] === "") {
    return;
  }
  if (event.target.className !== "cell") {
    return;
  }
  const cellIdx = event.target.dataset.index;
if (state.board[cellIdx].length !== 0) {
  return;
}
if (state.currentPlayerIdx === 0) {
  state.board[cellIdx] = 'X';
} else {
  state.board[cellIdx] = "O";
}
  console.log(state.board);
  changeTurn();
});

playerTurnElem.addEventListener("click", function (event) {
  if (event.target.className === "start") {
    const player1Input = document.querySelector("input[name=player1]");
    const player1Value = player1Input.value;
    state.players[0] = player1Value;
    const player2Input = document.querySelector("input[name=player2]");
    const player2Value = player2Input.value;
    state.players[1] = player2Value;
    if (!player2Value) {
      state.players[1] = 'the Computer';
    }
    changeTurn();
  };

  if (event.target.className === 'reset') {
    buildInitialState();
    render();
  }
});

buildInitialState();
render();