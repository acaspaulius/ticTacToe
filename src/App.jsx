import React, { useState, useEffect } from 'react';
import Player from './components/Player';
import GameBoard from './components/GameBoard';
import Log from './components/Log';
import GameOver from './components/GameOver';
import { WINNING_COMBINATIONS } from './winning-combinations';

const PLAYERS = {
  X: 'Player 1',
  O: 'Player 2',
};

const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function deriveActivePlayer(gameTurns) {
  return gameTurns.length % 2 === 0 ? 'X' : 'O';
}

function deriveGameBoard(gameTurns) {
  let gameBoard = [...INITIAL_GAME_BOARD.map((array) => [...array])];
  for (const turn of gameTurns) {
    const { square, player } = turn;
    gameBoard[square.row][square.col] = player;
  }
  return gameBoard;
}

function deriveWinner(gameBoard) {
  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol = gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol = gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol = gameBoard[combination[2].row][combination[2].column];
    if (firstSquareSymbol && firstSquareSymbol === secondSquareSymbol && firstSquareSymbol === thirdSquareSymbol) {
      return firstSquareSymbol;
    }
  }
  return null;
}

function App() {
  const [players, setPlayers] = useState(PLAYERS);
  const [gameTurns, setGameTurns] = useState([]);
  const [winCounts, setWinCounts] = useState({ X: 0, O: 0 });
  const [gameMode, setGameMode] = useState('two-player');
  const activePlayer = deriveActivePlayer(gameTurns);
  const gameBoard = deriveGameBoard(gameTurns);
  const winner = deriveWinner(gameBoard);
  const draw = gameTurns.length === 9 && !winner;

  useEffect(() => {
    if (winner) {
      setWinCounts((counts) => ({ ...counts, [winner]: counts[winner] + 1 }));
    }
    if (gameMode === 'single-player' && activePlayer === 'O' && !winner) {
      setTimeout(makeAIMove, 500);
    }
  }, [winner, gameTurns, gameMode, activePlayer]);

  function selectSquare(rowIndex, colIndex) {
    if (!gameBoard[rowIndex][colIndex] && !winner) {
      setGameTurns([{ square: { row: rowIndex, col: colIndex }, player: activePlayer }, ...gameTurns]);
    }
  }

  function makeAIMove() {
    const emptySquares = gameBoard.flatMap((row, rowIndex) =>
      row.map((col, colIndex) => (col === null ? { rowIndex, colIndex } : null)).filter((square) => square)
    );
    if (emptySquares.length > 0) {
      const randomSquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
      selectSquare(randomSquare.rowIndex, randomSquare.colIndex);
    }
  }

  function restart() {
    setGameTurns([]);
  }

  function playerNameChange(symbol, newName) {
    setPlayers((prevPlayers) => ({
      ...prevPlayers,
      [symbol]: newName,
    }));
  }

  function toggleGameMode() {
    setGameMode(gameMode === 'two-player' ? 'single-player' : 'two-player');
    restart();
    setWinCounts({ X: 0, O: 0 });
  }

  return (
    <main>
      <div id='game-container'>
        <ol id='players' className='highlight-player'>
          <div id='info-div'>
            <>
              <Player initialName={players.X} symbol='X' isActive={activePlayer === 'X'} playerNameChange={playerNameChange} />
              <Player initialName={players.O} symbol='O' isActive={activePlayer === 'O'} playerNameChange={playerNameChange} />
            </>
            <>
              <div className='win-count'>Wins: {winCounts.X}</div>
              <div className='win-count'>Wins: {winCounts.O}</div>
            </>
          </div>
        </ol>
        {(winner || draw) && <GameOver winner={PLAYERS[winner]} restart={restart} />}
        <GameBoard selectSquare={selectSquare} board={gameBoard} />
        <button id='game-mode' onClick={toggleGameMode}>
          Switch to {gameMode === 'two-player' ? 'Single Player' : 'Two Player'}
        </button>
      </div>
      <Log turns={gameTurns} />
    </main>
  );
}

export default App;
