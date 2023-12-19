import React, { useState } from 'react';

import axios from 'axios';


function TextInputPage() {
  const [text, setText] = useState('');

  const handleInputChange = (event) => {
    setText(event.target.value);
  };

  const handleEnter = async () => {
    //api call
    console.log("PREASEDFS");
    const response = await axios.post('/api/chat', {
      userInput: text
    });
  }


  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={handleInputChange}
        placeholder="Type something..."
      />
      <p>You typed: {text}</p>
      <button
        type="button"
        onClick={handleEnter}
      >
        Click ME!
      </button>
    </div>
  );
}

export default TextInputPage;
