const board = document.getElementById('board');
const status = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');
const modeSwitch = document.getElementById('modeSwitch');
const winLine = document.getElementById('winline');

let cells, currentPlayer, gameActive, aiMode;

function initGame() {
  const canvas = document.getElementById('winCanvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const board = document.getElementById('board');
  board.innerHTML = '';

  currentPlayer = 'X';
  gameActive = true;
  aiMode = modeSwitch.checked;
  cells = Array(9).fill('');

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', handleCellClick);
    board.appendChild(cell);
  }

  status.textContent = `Player ${currentPlayer}'s turn`;
}


function handleCellClick(e) {
  const idx = e.target.dataset.index;
  if (!gameActive || cells[idx] !== '') return;

  makeMove(idx, currentPlayer);

  const winCombo = checkWinner(currentPlayer);
  if (winCombo) {
    status.textContent = currentPlayer === 'O' && aiMode ? `🤖 AI wins!` : `🎉 Player ${currentPlayer} wins!`;
    showWinLine(winCombo);
    gameActive = false;
    return;
  } else if (!cells.includes('')) {
    status.textContent = `It's a draw!`;
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  status.textContent = `Player ${currentPlayer}'s turn`;

  if (aiMode && currentPlayer === 'O') {
    setTimeout(() => {
      const bestMove = getBestMove();
      makeMove(bestMove, 'O');

      const aiWin = checkWinner('O');
      if (aiWin) {
        status.textContent = `🤖 AI wins!`;
        showWinLine(aiWin);
        gameActive = false;
      } else if (!cells.includes('')) {
        status.textContent = `It's a draw!`;
        gameActive = false;
      } else {
        currentPlayer = 'X';
        status.textContent = `Player ${currentPlayer}'s turn`;
      }
    }, 300);
  }
}

function makeMove(idx, player) {
  cells[idx] = player;
  const cell = board.querySelector(`[data-index='${idx}']`);
  if (cell) cell.textContent = player;
}

function checkWinner(player) {
  const wins = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  for (const combo of wins) {
    if (combo.every(i => cells[i] === player)) {
      return combo; // Return winning combination
    }
  }
  return null;
}

function showWinLine(combo) {
  const canvas = document.getElementById('winCanvas');
  const ctx = canvas.getContext('2d');
  const cellSize = 110; // Slightly more than 100 to cover gap
  const offset = 55; // Half of cell + padding to center the line

  const start = combo[0];
  const end = combo[2];

  const startX = (start % 3) * cellSize + offset;
  const startY = Math.floor(start / 3) * cellSize + offset;
  const endX = (end % 3) * cellSize + offset;
  const endY = Math.floor(end / 3) * cellSize + offset;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
}





function getBestMove() {
  let bestScore = -Infinity;
  let move;

  cells.forEach((cell, i) => {
    if (cell === '') {
      cells[i] = 'O';
      let score = minimax(cells, 0, false);
      cells[i] = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  });

  return move;
}

function minimax(boardState, depth, isMaximizing) {
  if (checkWinner('O')) return 10 - depth;
  if (checkWinner('X')) return depth - 10;
  if (!boardState.includes('')) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    boardState.forEach((cell, i) => {
      if (cell === '') {
        boardState[i] = 'O';
        bestScore = Math.max(bestScore, minimax(boardState, depth + 1, false));
        boardState[i] = '';
      }
    });
    return bestScore;
  } else {
    let bestScore = Infinity;
    boardState.forEach((cell, i) => {
      if (cell === '') {
        boardState[i] = 'X';
        bestScore = Math.min(bestScore, minimax(boardState, depth + 1, true));
        boardState[i] = '';
      }
    });
    return bestScore;
  }
}

restartBtn.addEventListener('click', initGame);
modeSwitch.addEventListener('change', initGame);

// Start 
initGame();
