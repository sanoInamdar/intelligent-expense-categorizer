import React, { useState } from 'react';
import UploadReceipt from './components/UploadReceipt';
import ResultCard from './components/ResultCard';
import AnalysisChart from './components/AnalysisChart';
import { categorizeExpense } from './services/api';

function App() {
  const [result, setResult] = useState(null);
  const [isProcessingAPI, setIsProcessingAPI] = useState(false);
  const [error, setError] = useState('');

  const handleTextExtracted = async (text) => {
    if (!text || text.trim() === '') {
      setError('No text could be extracted from the image.');
      return;
    }

    setIsProcessingAPI(true);
    setError('');
    
    try {
      const response = await categorizeExpense(text);
      setResult(response);
    } catch (err) {
      setError('Failed to reach the backend server. Make sure it is running on port 8080.');
      console.error(err);
    } finally {
      setIsProcessingAPI(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Intelligent Expense</h1>
        <p>AI-powered receipt scanning & automatic categorization</p>
      </header>

      <main className="main-content">
        <div>
          <UploadReceipt 
            onTextExtracted={handleTextExtracted} 
            isProcessingAPI={isProcessingAPI}
          />
          {error && (
            <div style={{ color: '#ef4444', marginTop: '1rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '0.5rem', border: '1px solid #ef4444' }}>
              {error}
            </div>
          )}
        </div>
        
        <div>
          {result ? (
            <ResultCard result={result} />
          ) : (
            <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', opacity: 0.7 }}>
              <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                Upload a receipt to see the magic happen.<br/>
                We will automatically extract the details.
              </p>
            </div>
          )}
          <AnalysisChart />
        </div>
      </main>
    </div>
  );
}

export default App;
