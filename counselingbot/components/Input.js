import React, { useState, useEffect, useRef } from 'react';
import TextFormatter from './Textformat';
import Dropdown from './Dropdown';
import PdfButton from './PdfButton';
import { fileFromPath } from 'openai';


function TextInputPage() {
  const [text, setText] = useState('');
  const [height, setHeight] = useState('auto');
  const areaRef = useRef(null);
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setIsLoading] = useState(false);
  const [selectedSchool, setSchool] = useState('');
  const [transcript, setTranscript] = useState('');

  const SCHOOLS = [
    { name: 'UCI', url: 'https://catalogue.uci.edu/previouseditions/2013-14/pdf/2013-14.pdf' },
    { name: 'Purdue', url: 'https://catalog.purdue.edu/mime/media/16/11101/2023-2024+Courses.pdf'},
    { name: 'Upload Personal Transcript', url: 'transcript_counselbot.pdf'},
  ];

  const handleInputChange = (event) => {
    setText(event.target.value);
    adjustHeight();
  };

  const clearText = () => {
    setText('');
  }

  const adjustHeight = () => {
    if (areaRef.current) {
      areaRef.current.style.height = 'auto';
      areaRef.current.style.height = '${areaRef.current.scrollHeight}px';
      console.log(areaRef.current.style.height);
    }
  }

  const handleUrlSelect = (url) => {
    setSchool(url);
  }

  const handleTranscript = (file) => {
    setTranscript(file);
  }

  useEffect(() => {
    adjustHeight();
  }, [text]);

  const handleEnter = async () => {
    if (!text.trim()) {
      setAiResponse('Please enter a question.');
      return;
    }

    setIsLoading(true);

    const form = new FormData();
    form.append('prompt', text);
    form.append('school', selectedSchool);

    if (transcript) {
      form.append('transcripts', transcript, transcript.name);
    }

    try {
        const response = await fetch('/api/getAssistant', {
            method: 'POST',
            body: form,
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
        clearText();
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
      <strong>
        College Counseling Bot
      </strong>
      <Dropdown 
        schools={SCHOOLS}
        onUrlSelect={handleUrlSelect}
      />
      <PdfButton
        onFileProcess={handleTranscript}
      />
      <textarea
        type="text"
        value={text}
        onChange={handleInputChange}
        style={styling}
        placeholder="Type something..."
        ref={areaRef}
      />
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
