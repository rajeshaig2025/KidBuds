// src/components/MandatoryDisclosureModal.jsx
import React from 'react';
import { X, FileCheck2, ShieldCheck, Building2, CheckCircle2 } from 'lucide-react';
import SchoolCrestLogo from './SchoolCrestLogo';
import { mandatoryDisclosureData } from '../data/schoolData';

export default function MandatoryDisclosureModal({ isOpen, onClose, settings }) {
  if (!isOpen) return null;

  return (
    <div className="kb-admin-fullscreen" style={{ zIndex: 999 }}>
      {/* 1. Clean Single Header */}
      <div className="kb-admin-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <SchoolCrestLogo logoUrl={settings.logoUrl} schoolName={settings.schoolName} size={46} />
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#0d2757', fontWeight: 900, lineHeight: 1.2 }}>
              Mandatory Public Disclosure (HPBSE)
            </h3>
            <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>
              {settings.schoolName} {settings.subName} • Bijhari, Hamirpur (H.P.)
            </div>
          </div>
        </div>

        {/* Single Close Button */}
        <button
          onClick={onClose}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#f1f5f9',
            border: '1.5px solid var(--border-light)',
            color: '#0e2b5c',
            fontWeight: 800,
            fontSize: '0.88rem',
            padding: '9px 18px',
            borderRadius: '999px',
            cursor: 'pointer',
            transition: 'var(--transition)'
          }}
          title="Close Document"
        >
          <X size={17} />
          <span>Close</span>
        </button>
      </div>

      {/* 2. Full-Screen Official Document Body */}
      <div style={{ flex: 1, overflowY: 'auto', background: '#fafbfc', padding: '36px 0' }}>
        <div className="kb-container" style={{ maxWidth: 1040 }}>
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '2px solid var(--border-light)',
              boxShadow: '0 8px 30px rgba(13, 39, 87, 0.05)',
              padding: '36px 40px'
            }}
          >
            {/* Clean Document Top Subhead */}
            <div
              style={{
                borderBottom: '2px solid var(--border-light)',
                paddingBottom: '20px',
                marginBottom: '28px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
              }}
            >
              <div>
                <h2 style={{ fontSize: '1.45rem', color: '#0e2b5c', fontWeight: 900 }}>
                  Statutory Public Information & School Norms
                </h2>
                <div style={{ fontSize: '0.86rem', color: '#64748b', marginTop: '4px' }}>
                  In accordance with the Himachal Pradesh Board of School Education (HPBSE), Dharamshala
                </div>
              </div>
              <div
                style={{
                  background: '#f8fafc',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-light)'
                }}
              >
                <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700 }}>HPBSE Affiliation No: </span>
                <span style={{ fontSize: '0.94rem', color: '#0e2b5c', fontWeight: 900 }}>{settings.affiliationNo}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              {/* Section A: General Information */}
              <div>
                <h4
                  style={{
                    fontSize: '1.12rem',
                    color: '#0e2b5c',
                    marginBottom: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontWeight: 900
                  }}
                >
                  <FileCheck2 size={20} color="var(--brand-orange)" /> A. General School & Affiliation Information
                </h4>
                <div
                  style={{
                    border: '1.5px solid var(--border-light)',
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}
                >
                  {[
                    { label: 'Name of the School', value: `${settings.schoolName} ${settings.subName}` },
                    { label: 'Affiliated Board', value: settings.boardAffiliation },
                    { label: 'Affiliation Number / School Code', value: `${settings.affiliationNo} (School Code: ${settings.schoolCode})` },
                    { label: 'Classes Offered', value: 'Nursery to Class 12th (Science, Commerce & Arts Streams)' },
                    { label: 'Complete School Address', value: settings.address },
                    { label: 'Principal Name & Qualification', value: `${settings.principalName} (${settings.principalQualification})` },
                    { label: 'Official School Email & Phone', value: `${settings.email} • ${settings.phonePrimary}` }
                  ].map((row, idx) => (
                    <div
                      key={row.label}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1.6fr',
                        padding: '13px 20px',
                        background: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                        borderBottom: '1px solid var(--border-light)',
                        fontSize: '0.9rem'
                      }}
                    >
                      <div style={{ fontWeight: 800, color: '#0e2b5c' }}>{row.label}</div>
                      <div style={{ color: 'var(--text-body)', fontWeight: 600 }}>{row.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section B: Campus Infrastructure */}
              <div>
                <h4
                  style={{
                    fontSize: '1.12rem',
                    color: '#0e2b5c',
                    marginBottom: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontWeight: 900
                  }}
                >
                  <Building2 size={20} color="var(--brand-orange)" /> B. School Infrastructure & Safety Norms
                </h4>
                <div
                  style={{
                    border: '1.5px solid var(--border-light)',
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}
                >
                  {mandatoryDisclosureData.infrastructure.map((row, idx) => (
                    <div
                      key={row.label}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1.6fr',
                        padding: '13px 20px',
                        background: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                        borderBottom: '1px solid var(--border-light)',
                        fontSize: '0.9rem'
                      }}
                    >
                      <div style={{ fontWeight: 800, color: '#0e2b5c' }}>{row.label}</div>
                      <div style={{ color: 'var(--text-body)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                        <CheckCircle2 size={16} color="#16a34a" /> {row.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Note */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid var(--border-light)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  color: '#475569'
                }}
              >
                <ShieldCheck size={20} color="var(--brand-orange)" />
                Original physical certificates and affiliation records are open for inspection at the Administrative Office, Bijhari during working hours.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
