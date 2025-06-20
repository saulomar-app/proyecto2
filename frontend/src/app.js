import React, { useState } from 'react';
import Game from './components/Game';
import './App.css';

function App() {
  const [playerName, setPlayerName] = useState('');
  const [gameStarted, setGameStarted] = useState(false);

  const handleStartGame = () => {
    if (playerName.trim()) {
      setGameStarted(true);
    }
  };

  return (
    <div className="app-container">
      {!gameStarted ? (
        <div className="start-screen">
          <h1 className="animate__animated animate__bounceIn">English Checkers</h1>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <button className="btn btn-primary animate__animated animate__pulse" onClick={handleStartGame}>
            Start Game
          </button>
        </div>
      ) : (
        <Game playerName={playerName} />
      )}
    </div>
  );
}

export default App;