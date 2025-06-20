# English Checkers Game

A multiplayer English Checkers game built with Node.js, Express, Socket.IO, React, and Bootstrap.

## Setup Instructions

1. **Backend Setup**
   - Navigate to `backend/`
   - Run `npm install`
   - Start the server: `npm start`
   - Server runs on `http://localhost:4000`

2. **Frontend Setup**
   - Navigate to `frontend/`
   - Run `npm install`
   - Start the app: `npm start`
   - App runs on `http://localhost:3000`

3. **Playing the Game**
   - Open two browser tabs to simulate two players.
   - Enter a name and click "Start Game".
   - The game pairs players automatically.
   - Click a piece to select it, then click a valid square to move.

## Features
- Real-time multiplayer using WebSockets
- Animated start screen and piece movements
- Visual feedback for selected pieces and invalid moves
- Bootstrap for responsive design
- Error handling for disconnections and invalid moves

## Notes
- Move validation is a placeholder; implement full checkers rules as needed.
- Uses Animate.css for animations and Tailwind-inspired custom CSS.