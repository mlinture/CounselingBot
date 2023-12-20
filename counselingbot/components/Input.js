import React, { useState } from 'react';

import axios from 'axios';


function TextInputPage() {
  const [text, setText] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setIsLoading] = useState(false);

  const handleInputChange = (event) => {
    setText(event.target.value);
  };

  const handleEnter = async () => {
    //api call
    if (!text.trim()) {
      setAiResponse('Please enter a question.');
      return;
    }

    setIsLoading(true);
    try {
        const response = await fetch('/api/getAssistant', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: text }),
        });

        if (!response.ok) {
            throw new Error('Server responded with an error!');
        }

        const data = await response.json();
        console.log(data);
        setAiResponse(data.message);
    } catch (error) {
        console.error('Error:', error);
        setAiResponse('Sorry, something went wrong.');
    } finally {
        setIsLoading(false);
    }
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
        disabled={loading}
      >
        {loading ? 'Asking...' : 'Ask!!'}
      </button>
      <p>{aiResponse}</p>
    </div>
  );
}

export default TextInputPage;
