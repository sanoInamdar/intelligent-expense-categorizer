import React from 'react';
import { Building2, DollarSign, Calendar, Tag } from 'lucide-react';

const ResultCard = ({ result }) => {
  if (!result) return null;

  return (
    <div className="card">
      <div className="result-header">
        <Tag className="result-icon" />
        <h2>Categorization Result</h2>
      </div>

      <div className="result-item">
        <div className="result-label">
          <Building2 size={18} /> Merchant
        </div>
        <div className="result-value">{result.merchant}</div>
      </div>

      <div className="result-item">
        <div className="result-label">
          <DollarSign size={18} /> Amount
        </div>
        <div className="result-value">{result.amount !== "0.00" ? `${result.amount}` : "Not Found"}</div>
      </div>

      <div className="result-item">
        <div className="result-label">
          <Calendar size={18} /> Date
        </div>
        <div className="result-value">{result.date}</div>
      </div>

      <div className="result-item">
        <div className="result-label">
          <Tag size={18} /> Category
        </div>
        <div className="result-value">
          <span className="category-badge">{result.category}</span>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
