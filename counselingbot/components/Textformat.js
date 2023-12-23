import React from 'react';
import { marked } from 'marked';


const TextFormatter = ({ text }) => {
  const formattedText = marked(text);

  return (
    <div dangerouslySetInnerHTML={{ __html: formattedText }}></div>
  );
};

export default TextFormatter;
