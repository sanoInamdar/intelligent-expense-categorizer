import React, { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';
import { UploadCloud, FileText, Loader2 } from 'lucide-react';

const UploadReceipt = ({ onTextExtracted, isProcessingAPI }) => {
  const [image, setImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    
    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
    performOCR(imageUrl);
  };

  const performOCR = async (imageUrl) => {
    setIsProcessing(true);
    setExtractedText('');
    setProgress('Initializing OCR engine...');

    try {
      const result = await Tesseract.recognize(
        imageUrl,
        'eng',
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              setProgress(`Scanning: ${Math.round(m.progress * 100)}%`);
            } else {
              setProgress(m.status);
            }
          }
        }
      );
      
      const text = result.data.text;
      setExtractedText(text);
      onTextExtracted(text);
    } catch (error) {
      console.error("OCR Error:", error);
      setProgress('OCR processing failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="card">
      <div 
        className={`upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          className="file-input" 
          onChange={handleFileChange}
        />
        <UploadCloud className="upload-icon" />
        <h3>Click or drag receipt to upload</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          Supports JPG, PNG formats
        </p>
      </div>

      {image && (
        <img src={image} alt="Receipt Preview" className="preview-image" />
      )}

      {(isProcessing || isProcessingAPI) && (
        <div className="loader-container">
          <Loader2 className="spinner" />
          <p className="progress-text">
            {isProcessing ? progress : 'Categorizing Expense...'}
          </p>
        </div>
      )}

      {extractedText && !isProcessing && (
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <FileText size={18} color="var(--primary-color)" />
            <h4>Extracted Text</h4>
          </div>
          <textarea 
            className="ocr-text-area" 
            readOnly 
            value={extractedText}
          />
        </div>
      )}
    </div>
  );
};

export default UploadReceipt;
