import React, { useState } from 'react';

const Player = ({ initialName, symbol, isActive, playerNameChange }) => {
  const [name, setName] = useState(initialName);
  const [isEditing, setIsEditing] = useState(false);

  function edit() {
    setIsEditing((editing) => !editing);

    if (isEditing) {
      playerNameChange(symbol, name);
    }
  }

  function changeName(event) {
    console.log(event);
    setName(event.target.value);
  }

  return (
    <li className={isActive ? 'active' : undefined}>
      <span className='player'>
        {isEditing ? <input type='text' value={name} required onChange={changeName} /> : <span className='player-name'>{name}</span>}

        <span className='player-symbol'>{symbol}</span>
      </span>
      <button onClick={edit}>{isEditing ? 'Save' : 'Edit'}</button>
    </li>
  );
};

export default Player;
