import React from 'react';

function Board({ board, selectedPiece, onSquareClick }) {
  return (
    <div className="board mx-auto">
      {board.map((row, rowIndex) =>
        row.map((square, colIndex) => {
          const isLight = (rowIndex + colIndex) % 2 === 0;
          const isSelected =
            selectedPiece &&
            selectedPiece.row === rowIndex &&
            selectedPiece.col === colIndex;
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`square ${isLight ? 'light' : 'dark'} ${
                isSelected ? 'highlight' : ''
              }`}
              onClick={() => onSquareClick(rowIndex, colIndex)}
            >
              {square && (
                <div
                  className={`piece ${square.color} ${square.king ? 'king' : ''} ${
                    isSelected ? 'selected' : ''
                  }`}
                />
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default Board;