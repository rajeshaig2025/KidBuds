// src/components/SchoolCrestLogo.jsx
import React from 'react';

export default function SchoolCrestLogo({ logoUrl, schoolName, size = 88, className = '' }) {
  const effectiveUrl = (logoUrl && logoUrl.trim() !== '') ? logoUrl : '/school_logo.jpg';

  return (
    <div
      className={`school-custom-logo-wrap ${className}`}
      style={{
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        background: '#ffffff',
        padding: '5px 8px',
        borderRadius: '16px',
        border: '2px solid rgba(242, 92, 5, 0.45)', // Vivid Brand Orange & Gold Border
        boxShadow: '0 6px 20px -3px rgba(13, 39, 87, 0.12), 0 0 0 3px rgba(13, 39, 87, 0.04)',
        transition: 'all 0.3s ease'
      }}
    >
      <img
        src={effectiveUrl}
        alt={schoolName || 'Kid Buds Public Sr. Sec. School'}
        style={{
          height: '100%',
          width: 'auto',
          objectFit: 'contain',
          borderRadius: '10px'
        }}
      />
    </div>
  );
}
