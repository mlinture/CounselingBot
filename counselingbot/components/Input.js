import React, { useState, useEffect, useRef } from 'react';
import TextFormatter from './Textformat';



function TextInputPage() {
  const [text, setText] = useState('');
  const [height, setHeight] = useState('auto');
  const areaRef = useRef(null);
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setIsLoading] = useState(false);

  const handleInputChange = (event) => {
    setText(event.target.value);
    adjustHeight();
  };

  const adjustHeight = () => {
    if (areaRef.current) {
      areaRef.current.style.height = 'auto';
      areaRef.current.style.height = '${areaRef.current.scrollHeight}px';
      console.log(areaRef.current.style.height);
    }
  }

  useEffect(() => {
    adjustHeight();
  }, [text]);

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
        console.log(data.toString());
        setAiResponse(data.message);
    } catch (error) {
        console.error('Error:', error);
        setAiResponse('Sorry, something went wrong.');
    } finally {
        setIsLoading(false);
    }
  }

  const styling = {
    width: '100%',
    minHeight: '50px', // Minimum height
    maxHeight: '300px', // Maximum height before scrolling
    padding: '10px',
    boxSizing: 'border-box',
    overflowY: 'auto', // Allows scrolling
    resize: 'none',
    fontFamily: 'Calibri, sans-serif',
    fontSize: '16px',
    lineHeight: '1.5',
    border: '1px solid #ccc',
  };


  return (
    <div>
      <textarea
        type="text"
        value={text}
        onChange={handleInputChange}
        style={styling}
        placeholder="Type something..."
        ref={areaRef}
      />
      <p>You typed: {text}</p>
      <button
        type="button"
        onClick={handleEnter}
        disabled={loading}
      >
        {loading ? 'Asking...' : 'Ask!!'}
      </button>
      <TextFormatter text={aiResponse} />
    </div>
  );
}

export default TextInputPage;
