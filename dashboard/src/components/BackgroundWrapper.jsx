// src/components/BackgroundWrapper.jsx
import React from 'react';
import containerImg from '../components/images/container3.png';

const BackgroundWrapper = ({ children }) => {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{
        backgroundImage: `url(${containerImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        margin: 0,
        padding: 0,
      }}
    >
      <div className="w-full max-w-4xl px-4">{children}</div>
    </div>
  );
};

export default BackgroundWrapper;