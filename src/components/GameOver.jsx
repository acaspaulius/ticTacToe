import React from 'react';

const GameOver = ({ winner, restart }) => {
  return (
    <div id='game-over'>
      <h2>Game Over!</h2>
      {winner && <p>{winner} won!</p>}
      {!winner && <p>It&apos;s a draw!</p>}
      <p>
        <button onClick={() => restart()}>Rematch!</button>
      </p>
    </div>
  );
};

export default GameOver;
