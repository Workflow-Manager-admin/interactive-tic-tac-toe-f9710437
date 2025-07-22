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

  // --- Chat state and logic ---
  // Enhance message to support emoji reactions (object: {text, reactions: {emoji: count}, matchReactions: number})
  const EMOJIS = ["😀", "🎉", "👍", "😲", "❤️"];
  const MATCH_REACTION_ICON = "🏆";
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  // PUBLIC_INTERFACE
  /**
   * Handles sending a new chat message.
   * Adds message to chat, clears the input.
   */
  function handleSendMessage(e) {
    e.preventDefault();
    const trimmed = chatInput.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      {
        text: trimmed,
        reactions: {},
        matchReactions: 0 // initialize trophy count
      }
    ]);
    setChatInput("");
  }

  /**
   * Handles emoji reaction for a specific chat message.
   * Increments the count for the emoji on the selected message (local state only).
   */
  // PUBLIC_INTERFACE
  function handleReact(idx, emoji) {
    setMessages(msgs =>
      msgs.map((m, i) =>
        i === idx
          ? {
              ...m,
              reactions: {
                ...m.reactions,
                [emoji]: (m.reactions && m.reactions[emoji] ? m.reactions[emoji] : 0) + 1,
              }
            }
          : m
      )
    );
  }

  /**
   * Handles match reaction (trophy) for a specific message.
   * Increments the count for the match reaction (local state).
   */
  // PUBLIC_INTERFACE
  function handleMatchReaction(idx) {
    setMessages(msgs =>
      msgs.map((m, i) =>
        i === idx
          ? { ...m, matchReactions: (m.matchReactions ? m.matchReactions + 1 : 1) }
          : m
      )
    );
  }

  // Renders a row of emojis below each message, with their counters
  function renderReactions(msg, idx) {
    return (
      <div style={{
        display: 'flex',
        gap: '0.5em',
        marginTop: 2,
        fontSize: '1.18em',
        opacity: 0.92,
        background: 'none',
        alignItems: "center"
      }}>
        {/* Match Reaction Trophy Special Button */}
        <button
          type="button"
          onClick={() => handleMatchReaction(idx)}
          aria-label="Add match reaction"
          className="ttt-match-reaction-btn"
          style={{
            border: '2px solid var(--ttt-accent)',
            background: 'var(--ttt-cell-hover)',
            color: '#E69F27',
            cursor: 'pointer',
            padding: '1.5px 9px',
            borderRadius: '7px',
            fontSize: '1.18em',
            fontWeight: 700,
            minWidth: 32,
            marginRight: 2,
            outline: 'none',
            boxShadow: msg.matchReactions > 0 ? '0 2px 8px 0 #ffe5a1' : 'none',
            transition: 'background 0.16s, box-shadow 0.13s, border-color 0.12s'
          }}
        >
          <span style={{
            filter: "drop-shadow(0 0 2px #fff7dc)",
            textShadow: "1px 1px 0 #fffbe6"
          }}>{MATCH_REACTION_ICON}</span>
          {msg.matchReactions > 0 &&
            <span style={{
              marginLeft: 4,
              color: "#E69F27",
              fontWeight: 700,
              fontSize: "0.98em",
              background: "#fff8e4",
              borderRadius: "8px",
              padding: "1.5px 6px",
              border: "1px solid #e1bc80",
              marginRight: -4,
              marginTop: -2,
              verticalAlign: "middle"
            }}>{msg.matchReactions}</span>
          }
        </button>
        {/* Emoji reactions */}
        {EMOJIS.map(e => (
          <button
            key={e}
            type="button"
            onClick={() => handleReact(idx, e)}
            aria-label={`React ${e}`}
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              padding: '1.5px 7px',
              borderRadius: '6px',
              fontSize: '1.1em',
              minWidth: 28,
              color: '#2D9CDB',
              transition: 'background 0.13s, box-shadow 0.13s',
              boxShadow: msg.reactions && msg.reactions[e] ? '0 1px 2px 0 #eef6fd' : 'none',
              outline: 'none',
            }}
            className="ttt-emoji-btn"
          >
            {e}
            {msg.reactions && msg.reactions[e] > 0 &&
              <span style={{
                marginLeft: 3,
                fontSize: '0.95em',
                color: '#27AE60',
                fontWeight: 600,
                verticalAlign: 'middle'
              }}>{msg.reactions[e]}</span>
            }
          </button>
        ))}
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
        {/* --- Chat UI --- */}
        <div className="ttt-chatbox">
          <div className="ttt-chat-messages" aria-live="polite">
            {messages.length === 0 ? (
              <div className="ttt-chat-placeholder">Start chatting...</div>
            ) : (
              messages.map((msg, idx) => (
                <div className="ttt-chat-message" key={idx} style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  <span>{msg.text}</span>
                  {renderReactions(msg, idx)}
                </div>
              ))
            )}
          </div>
          <form className="ttt-chat-form" onSubmit={handleSendMessage} autoComplete="off">
            <input
              className="ttt-chat-input"
              type="text"
              value={chatInput}
              maxLength={200}
              placeholder="Type a message…"
              onChange={e => setChatInput(e.target.value)}
              aria-label="Chat message"
            />
            <button className="ttt-chat-send-btn" type="submit" disabled={!chatInput.trim()}>Send</button>
          </form>
        </div>
        {/* --- End Chat UI --- */}
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
