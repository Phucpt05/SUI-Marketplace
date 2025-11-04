import React from 'react';

const SimpleSilk: React.FC = () => {
  return (
    <div
      className="absolute inset-0"
      style={{
        background: 'linear-gradient(45deg, #0F1F3A, #061124, #020B1A, #0F1F3A)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
        zIndex: 0,
      }}
    />
  );
};

export default SimpleSilk;