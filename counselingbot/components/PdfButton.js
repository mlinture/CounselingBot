import React, { useRef, useState } from 'react';

const PdfButton = ({ onFileProcess }) => {
    const fileInputRef = useRef();
    const [uploadStatus, setUploadStatus] = useState('');

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setUploadStatus('Uploading...');
            
            try {
                await onFileProcess(file);
                setUploadStatus('File has been attached successfully.');
            } catch (error) {
                setUploadStatus('Error during file processing.');
                console.error('Error processing file:', error);
            }
        }
    };

    const handleClick = () => {
        setUploadStatus('');
        fileInputRef.current.click();
    };

    return (
        <div>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".pdf"
                onChange={handleFileChange}
            />
            <button onClick={handleClick}>Upload and Process PDF</button>
            {uploadStatus && <div>{uploadStatus}</div>}
        </div>
    );
};

export default PdfButton;
