const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(express.static(path.join(__dirname, '../frontend/build')));

let games = {};
let players = {};

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  socket.on('joinGame', () => {
    let gameId = Object.keys(games).find(id => games[id].players.length < 2);
    if (!gameId) {
      gameId = Date.now().toString();
      games[gameId] = {
        players: [{ id: socket.id, color: 'red' }],
        board: initializeBoard(),
        turn: 'red',
        moves: []
      };
    } else {
      games[gameId].players.push({ id: socket.id, color: 'black' });
    }
    players[socket.id] = gameId;
    socket.join(gameId);
    io.to(gameId).emit('gameState', games[gameId]);
  });

  socket.on('makeMove', ({ from, to }) => {
    const gameId = players[socket.id];
    const game = games[gameId];
    if (game && game.turn === game.players.find(p => p.id === socket.id).color) {
      const move = validateMove(game.board, from, to, game.turn);
      if (move.valid) {
        applyMove(game.board, from, to, move);
        game.turn = game.turn === 'red' ? 'black' : 'red';
        game.moves.push({ from, to });
        io.to(gameId).emit('gameState', game);
      } else {
        socket.emit('invalidMove', move.reason);
      }
    }
  });

  socket.on('disconnect', () => {
    const gameId = players[socket.id];
    if (gameId && games[gameId]) {
      games[gameId].players = games[gameId].players.filter(p => p.id !== socket.id);
      if (games[gameId].players.length === 0) {
        delete games[gameId];
      } else {
        io.to(gameId).emit('playerDisconnected');
      }
      delete players[socket.id];
    }
    console.log(`Player disconnected: ${socket.id}`);
  });
});

function initializeBoard() {
  const board = Array(8).fill().map(() => Array(8).fill(null));
  for (let row = 0; row < 3; row++) {
    for (let col = (row % 2 === 0 ? 1 : 0); col < 8; col += 2) {
      board[row][col] = { color: 'black', king: false };
    }
  }
  for (let row = 5; row < 8; row++) {
    for (let col = (row % 2 === 0 ? 1 : 0); col < 8; col += 2) {
      board[row][col] = { color: 'red', king: false };
    }
  }
  return board;
}

function validateMove(board, from, to, turn) {
  return { valid: true }; // Placeholder
}

function applyMove(board, from, to, move) {
  board[to.row][to.col] = board[from.row][from.col];
  board[from.row][from.col] = null;
}

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));