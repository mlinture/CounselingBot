import React, { useState } from 'react';

function TextInputPage() {
  const [text, setText] = useState('');

  const handleInputChange = (event) => {
    setText(event.target.value);
  };

  const handleEnter = (event) => {
    if (event.key === 'Enter')
    {
      //api call
      console.log("PREASEDFS");
    }
  }

  // api call 

  return (
    <div>
      <h1>Text Input Example</h1>
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
