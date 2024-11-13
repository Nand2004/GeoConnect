import React, { useEffect } from 'react';

const ImageEnlarged = ({ image, onClose }) => {
  useEffect(() => {
    if (!image) return; // Exit early if there's no image to display

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [image, onClose]);

  if (!image) return null; // Moved after the useEffect to avoid conditional hook call

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
      style={{ 
        background: 'rgba(0,0,0,0.8)', 
        zIndex: 1050,
        backdropFilter: 'blur(5px)'
      }}
      onClick={onClose}
    >
      <img 
        src={image} 
        alt="enlarged" 
        className="img-fluid shadow-lg rounded" 
        style={{ 
          maxHeight: '90vh', 
          maxWidth: '90vw', 
          objectFit: 'contain',
          transition: 'transform 0.2s ease-in-out',
          transform: 'scale(0.95)',
          animation: 'fadeIn 0.2s ease-in-out'
        }} 
        onClick={(e) => e.stopPropagation()}
      />
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(0.95); }
          }
        `}
      </style>
    </div>
  );
};

export default ImageEnlarged;
