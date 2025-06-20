import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Board from './Board';

const socket = io('http://localhost:4000');

function Game({ playerName }) {
  const [gameState, setGameState] = useState(null);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    socket.emit('joinGame');

    socket.on('gameState', (state) => {
      setGameState(state);
    });

    socket.on('invalidMove', (reason) => {
      setError(reason);
      setTimeout(() => setError(''), 3000);
    });

    socket.on('playerDisconnected', () => {
      setError('Opponent disconnected. Waiting for new player...');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSquareClick = (row, col) => {
    if (!gameState) return;

    const playerColor = gameState.players.find(p => p.id === socket.id)?.color;
    if (gameState.turn !== playerColor) {
      setError("Not your turn!");
      return;
    }

    const piece = gameState.board[row][col];
    if (!selectedPiece && piece && piece.color === playerColor) {
      setSelectedPiece({ row, col });
    } else if (selectedPiece) {
      socket.emit('makeMove', {
        from: { row: selectedPiece.row, col: selectedPiece.col },
        to: { row, col }
      });
      setSelectedPiece(null);
    }
  };

  if (!gameState) {
    return <div className="text-center">Waiting for opponent...</div>;
  }

  return (
    <div className="game-container text-center">
      <h2>English Checkers</h2>
      <p>Playing as: {gameState.players.find(p => p.id === socket.id)?.color}</p>
      <p>Turn: {gameState.turn}</p>
      {error && <div className="alert alert-danger animate__animated animate__shakeX">{error}</div>}
      <Board
        board={gameState.board}
        selectedPiece={selectedPiece}
        onSquareClick={handleSquareClick}
      />
    </div>
  );
}

export default Game;