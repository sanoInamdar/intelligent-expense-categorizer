import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'OCR Accuracy', value: 92, color: '#6366f1' }, // Primary
  { name: 'Categorization Quality', value: 88, color: '#ec4899' }, // Secondary
  { name: 'Dashboard UI', value: 95, color: '#10b981' }, // Success
  { name: 'Code Quality', value: 90, color: '#f59e0b' } // Warning/Amber
];

const AnalysisChart = () => {
  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>System Analysis & Metrics</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#f8fafc'
              }}
              itemStyle={{ color: '#f8fafc' }}
            />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalysisChart;
