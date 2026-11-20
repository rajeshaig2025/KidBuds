// src/components/SchoolCrestLogo.jsx
import React from 'react';

export default function SchoolCrestLogo({ logoUrl, schoolName, size = 88, className = '' }) {
  const effectiveUrl = (logoUrl && logoUrl.trim() !== '') ? logoUrl : '/school_logo.jpg';

  return (
    <div
      className={`school-custom-logo-wrap ${className}`}
      style={{
        '--logo-size': `${size}px`,
        height: 'var(--logo-size, 88px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        background: '#ffffff',
        padding: '4px 6px',
        borderRadius: '14px',
        border: '2px solid rgba(34, 197, 94, 0.35)', // Refined Soft Spring Green Border
        boxShadow: '0 4px 16px -2px rgba(9, 56, 36, 0.08)',
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
          borderRadius: '8px'
        }}
      />
    </div>
  );
}
