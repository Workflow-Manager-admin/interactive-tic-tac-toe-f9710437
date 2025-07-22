import React, { useState, useEffect } from 'react';
import './App.css';

// PUBLIC_INTERFACE
/**
 * The main App component for the Tic Tac Toe game.
 * - Renders a centered minimalistic 3x3 grid.
 * - Handles Player vs Player logic, move validation, win/draw status, and reset.
 * - Follows a light, minimalistic theme using specified colors.
 */
function App() {
  // Define theme colors
  const COLORS = {
    accent: "#27AE60",
    primary: "#2D9CDB",
    secondary: "#56CCF2",
    light: "#ffffff",
    border: "#e9ecef"
  };

  // Tic tac toe state
  const initialState = Array(9).fill(null);
  const [squares, setSquares] = useState(initialState);
  const [isXNext, setIsXNext] = useState(true);
  const [status, setStatus] = useState('');
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);

  // Update game status on state change
  useEffect(() => {
    const win = calculateWinner(squares);
    if (win) {
      setWinner(win);
      setStatus(`Player ${win === 'X' ? '1' : '2'} (${win}) wins!`);
      setIsDraw(false);
    } else if (squares.every((sq) => sq)) {
      setIsDraw(true);
      setStatus("It's a draw!");
      setWinner(null);
    } else {
      setIsDraw(false);
      setWinner(null);
      setStatus(`Next: Player ${isXNext ? '1 (X)' : '2 (O)'}`);
    }
  }, [squares, isXNext]);

  /**
   * Handler for clicking a cell
   * @param {number} idx - index of the cell clicked
   */
  // PUBLIC_INTERFACE
  function handleClick(idx) {
    if (squares[idx] || winner) return; // invalid move
    const next = squares.slice();
    next[idx] = isXNext ? 'X' : 'O';
    setSquares(next);
    setIsXNext(!isXNext);
  }

  /**
   * Handler to reset the game state
   */
  // PUBLIC_INTERFACE
  function handleReset() {
    setSquares(initialState);
    setIsXNext(true);
    setStatus('');
    setWinner(null);
    setIsDraw(false);
  }

  // Board rendering as 3x3 grid
  function renderCell(idx) {
    return (
      <button
        className="ttt-cell"
        onClick={() => handleClick(idx)}
        style={{
          color:
            squares[idx] === 'X'
              ? COLORS.primary
              : squares[idx] === 'O'
                ? COLORS.accent
                : COLORS.light,
          borderColor:
            (winner && isCellWinning(idx, squares)) ? COLORS.accent : COLORS.border,
        }}
        data-testid={`cell-${idx}`}
        aria-label={`Cell ${idx + 1}: ${squares[idx] ? squares[idx] : "empty"}`}
        disabled={!!squares[idx] || !!winner}
        key={idx}
      >
        {squares[idx]}
      </button>
    );
  }

  function renderBoard() {
    return (
      <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
        {[0, 1, 2].map((row) =>
          <div className="ttt-row" key={`row-${row}`} role="row">
            {[0, 1, 2].map((col) =>
              renderCell(row * 3 + col)
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="ttt-app-bg">
      <div className="ttt-container">
        <h1 className="ttt-title" style={{ color: COLORS.primary }}>Tic Tac Toe</h1>
        <div className="ttt-status"
          style={
            winner
              ? { color: COLORS.accent }
              : isDraw ? { color: COLORS.secondary } : {}
          }
        >
          {status}
        </div>
        {renderBoard()}
        <div className="ttt-controls">
          <button className="ttt-reset-btn" onClick={handleReset}>
            {winner || isDraw ? "Play Again" : "Reset"}
          </button>
        </div>
        <div className="ttt-player-info">
          <span style={{ color: COLORS.primary }}>
            X: Player 1
          </span>
          <span style={{ color: COLORS.accent }}>
            O: Player 2
          </span>
        </div>
      </div>
      <footer className="ttt-footer">
        <span>
          Minimal UI &mdash; powered by React &middot;&nbsp;
          <span style={{ color: COLORS.primary }}>Kavia Style</span>
        </span>
      </footer>
    </div>
  );
}

/**
 * Determines the winner if exists.
 */
function calculateWinner(sq) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],        // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8],        // cols
    [0, 4, 8], [2, 4, 6]                    // diagonals
  ];
  for (let [a, b, c] of lines) {
    if (sq[a] && sq[a] === sq[b] && sq[a] === sq[c]) {
      return sq[a];
    }
  }
  return null;
}

/**
 * Helper to highlight winner cells.
 */
function isCellWinning(idx, sq) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (sq[a] && sq[a] === sq[b] && sq[a] === sq[c] && line.includes(idx)) {
      return true;
    }
  }
  return false;
}

export default App;
