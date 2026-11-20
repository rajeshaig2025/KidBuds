// src/components/AdminDashboardModal.jsx
// Kid Buds Public Senior Secondary School, Bijhari (Hamirpur, H.P.)
// Phase 1 Dynamic Admin Panel + Future-Ready Portal Foundation

import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Settings,
  Image as ImageIcon,
  Bell,
  Users,
  Award,
  Camera,
  Inbox,
  Cloud,
  Upload,
  Trash2,
  Plus,
  CheckCircle2,
  Phone,
  MessageSquare,
  RotateCcw,
  Save,
  Lock,
  Key,
  Eye,
  EyeOff,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';
import SchoolCrestLogo from './SchoolCrestLogo';
import { optimizeImage } from '../utils/imageOptimizer';
import {
  COLLECTIONS,
  fetchSchoolConfigFromCloud,
  saveSchoolConfigToCloud,
  syncCollectionToCloud,
  deleteDocFromCloud,
  testFirebaseConnection,
  uploadSchoolMedia
} from '../services/firebaseService';

export default function AdminDashboardModal({
  isOpen,
  onClose,
  settings,
  setSettings,
  heroSlides,
  setHeroSlides,
  notices,
  setNotices,
  staff,
  setStaff,
  toppers,
  setToppers,
  gallery,
  setGallery,
  enquiries,
  setEnquiries,
  onResetDefaults
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [activeTab, setActiveTab] = useState('settings');
  const [statusBanner, setStatusBanner] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Draft Settings State for instant editing
  const [draftSettings, setDraftSettings] = useState(settings);

  // Security PIN Change State
  const [pinChangeForm, setPinChangeForm] = useState({
    currentPin: '',
    newPin: '',
    confirmPin: ''
  });
  const [pinChangeMsg, setPinChangeMsg] = useState({ type: '', text: '' });
  const [showPinState, setShowPinState] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // New Item Forms
  const [newSlide, setNewSlide] = useState({
    badge: 'HPBOSE Dharamshala Affiliated • Nursery to 12th',
    title: '',
    subtitle: '',
    image: '',
    ctaPrimary: 'Apply for Admission',
    ctaSecondary: 'Explore Academics',
    highlightTag: 'Smart Classrooms & Advanced Labs'
  });

  const [newNotice, setNewNotice] = useState({
    title: '',
    category: 'Circular',
    date: new Date().toISOString().split('T')[0],
    isImportant: true,
    summary: '',
    attachmentUrl: ''
  });

  const [newStaff, setNewStaff] = useState({
    name: '',
    designation: '',
    department: 'Senior Secondary (PGT)',
    qualification: '',
    subject: '',
    experience: '',
    image: ''
  });

  const [newTopper, setNewTopper] = useState({
    name: '',
    classLevel: 'Class 12th Board',
    stream: 'Science (Non-Medical)',
    percentage: '',
    rank: 'HPBOSE Merit Holder',
    year: '2025',
    image: ''
  });

  const [newPhoto, setNewPhoto] = useState({
    title: '',
    category: 'Campus & Infrastructure',
    date: '2026',
    image: ''
  });

  const [firebaseForm, setFirebaseForm] = useState(() => {
    try {
      const saved = localStorage.getItem('kb_firebase_config');
      return saved ? JSON.parse(saved) : { apiKey: '', authDomain: '', projectId: '', storageBucket: '', appId: '' };
    } catch {
      return { apiKey: '', authDomain: '', projectId: '', storageBucket: '', appId: '' };
    }
  });

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSyncingAll, setIsSyncingAll] = useState(false);

  // Sync latest settings directly from Google Cloud Firestore whenever modal opens
  useEffect(() => {
    if (isOpen) {
      async function syncLatest() {
        try {
          const freshCloudConfig = await fetchSchoolConfigFromCloud();
          if (freshCloudConfig) {
            setSettings(freshCloudConfig);
            setDraftSettings(freshCloudConfig);
            localStorage.setItem('kb_school_settings', JSON.stringify(freshCloudConfig));
          }
        } catch (err) {
          console.warn('Sync latest on modal open skipped:', err);
        }
      }
      syncLatest();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const showToast = (msg) => {
    setStatusBanner(msg);
    setTimeout(() => setStatusBanner(''), 4000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setPinError('');
    setIsLoggingIn(true);

    try {
      // 1. Fetch live real-time configuration directly from Google Cloud Firestore
      const freshCloudConfig = await fetchSchoolConfigFromCloud();
      
      let livePin = '';
      if (freshCloudConfig && freshCloudConfig.adminPin) {
        livePin = String(freshCloudConfig.adminPin).trim();
      } else if (settings && settings.adminPin) {
        livePin = String(settings.adminPin).trim();
      } else {
        livePin = 'kidbuds2026';
      }

      const enteredPin = pinInput.trim();

      if (enteredPin === livePin) {
        setIsAuthenticated(true);
        if (freshCloudConfig) {
          setSettings(freshCloudConfig);
          setDraftSettings(freshCloudConfig);
          localStorage.setItem('kb_school_settings', JSON.stringify(freshCloudConfig));
        } else {
          setDraftSettings(settings);
        }
        setPinError('');
      } else {
        if (enteredPin === 'kidbuds2026' && livePin !== 'kidbuds2026') {
          setPinError('The default PIN (kidbuds2026) has expired. Please enter the updated Admin Security PIN.');
        } else {
          setPinError('Invalid Admin PIN. Please enter the correct Security PIN.');
        }
      }
    } catch (err) {
      console.error('Login verification error:', err);
      setPinError('Verification error: ' + err.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleChangePin = async (e) => {
    e.preventDefault();
    setPinChangeMsg({ type: '', text: '' });

    const activeCurrentPin = (settings.adminPin || 'kidbuds2026').trim();
    if (pinChangeForm.currentPin.trim() !== activeCurrentPin) {
      setPinChangeMsg({ type: 'error', text: 'Current Admin PIN is incorrect. Please enter your existing PIN.' });
      return;
    }

    if (!pinChangeForm.newPin || pinChangeForm.newPin.trim().length < 6) {
      setPinChangeMsg({ type: 'error', text: 'New PIN must be at least 6 characters (letters or numbers).' });
      return;
    }

    if (pinChangeForm.newPin.trim() !== pinChangeForm.confirmPin.trim()) {
      setPinChangeMsg({ type: 'error', text: 'New PIN and Confirm PIN do not match. Please verify.' });
      return;
    }

    const updatedSettings = {
      ...settings,
      adminPin: pinChangeForm.newPin.trim()
    };

    setSettings(updatedSettings);
    setDraftSettings(updatedSettings);
    localStorage.setItem('kb_school_settings', JSON.stringify(updatedSettings));
    await saveSchoolConfigToCloud(updatedSettings);

    setPinChangeForm({ currentPin: '', newPin: '', confirmPin: '' });
    setPinChangeMsg({
      type: 'success',
      text: 'Admin PIN successfully updated and synchronized to Google Cloud Firestore!'
    });
    showToast('Admin Security PIN changed and synced to Google Cloud!');
  };

  // Universal Image Upload Handler (Optimizes to WebP + attempts Firebase Storage or uses instant dataUrl)
  const handlePhotoUpload = async (file, folder, onSuccess) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const opt = await optimizeImage(file, { maxWidth: 1400, maxHeight: 1000, quality: 0.84 });
      let finalUrl = opt.dataUrl;
      try {
        const cloudUrl = await uploadSchoolMedia(opt.file, folder);
        if (cloudUrl) finalUrl = cloudUrl;
      } catch {
        // Use optimized WebP dataUrl seamlessly
      }
      onSuccess(finalUrl, opt);
      showToast(`Photo optimized (${opt.originalSizeFormatted} → ${opt.compressedSizeFormatted} WebP)!`);
    } catch (err) {
      alert('Photo upload error: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSettings(draftSettings);
    localStorage.setItem('kb_school_settings', JSON.stringify(draftSettings));
    await saveSchoolConfigToCloud(draftSettings);
    showToast('School Logo, Contact Details & Site Settings saved and published live!');
  };

  // Add Hero Slide
  const handleAddSlide = async (e) => {
    e.preventDefault();
    if (!newSlide.title || !newSlide.image) {
      alert('Please enter a slide title and upload/paste an image.');
      return;
    }
    const item = { ...newSlide, id: 'hero-' + Date.now() };
    const updated = [item, ...heroSlides];
    setHeroSlides(updated);
    localStorage.setItem('kb_hero_slides', JSON.stringify(updated));
    await syncCollectionToCloud(COLLECTIONS.HERO, updated);
    setNewSlide({
      badge: 'HPBOSE Dharamshala Affiliated • Nursery to 12th',
      title: '',
      subtitle: '',
      image: '',
      ctaPrimary: 'Apply for Admission',
      ctaSecondary: 'Explore Academics',
      highlightTag: 'Smart Classrooms & Advanced Labs'
    });
    showToast('New Hero Banner Slide published to Homepage!');
  };

  const handleDeleteSlide = async (id) => {
    if (heroSlides.length <= 1) {
      alert('At least 1 Hero Slide is required on the homepage.');
      return;
    }
    const updated = heroSlides.filter((s) => s.id !== id);
    setHeroSlides(updated);
    localStorage.setItem('kb_hero_slides', JSON.stringify(updated));
    await deleteDocFromCloud(COLLECTIONS.HERO, id);
    showToast('Hero Slide removed.');
  };

  // Add Notice
  const handleAddNotice = async (e) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.summary) {
      alert('Please enter notice title and summary details.');
      return;
    }
    const item = { ...newNotice, id: 'not-' + Date.now() };
    const updated = [item, ...notices];
    setNotices(updated);
    localStorage.setItem('kb_notices', JSON.stringify(updated));
    await syncCollectionToCloud(COLLECTIONS.NOTICES, updated);
    setNewNotice({
      title: '',
      category: 'Circular',
      date: new Date().toISOString().split('T')[0],
      isImportant: true,
      summary: '',
      attachmentUrl: ''
    });
    showToast('New Notice published to Live Notice Board!');
  };

  const handleDeleteNotice = async (id) => {
    const updated = notices.filter((n) => n.id !== id);
    setNotices(updated);
    localStorage.setItem('kb_notices', JSON.stringify(updated));
    await deleteDocFromCloud(COLLECTIONS.NOTICES, id);
    showToast('Notice deleted.');
  };

  // Add Staff
  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.designation) {
      alert('Please enter faculty name and designation.');
      return;
    }
    const item = {
      ...newStaff,
      id: 'st-' + Date.now(),
      image: newStaff.image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80'
    };
    const updated = [...staff, item];
    setStaff(updated);
    localStorage.setItem('kb_faculty', JSON.stringify(updated));
    await syncCollectionToCloud(COLLECTIONS.STAFF, updated);
    setNewStaff({
      name: '',
      designation: '',
      department: 'Senior Secondary (PGT)',
      qualification: '',
      subject: '',
      experience: '',
      image: ''
    });
    showToast('Faculty profile added to Staff Directory!');
  };

  const handleDeleteStaff = async (id) => {
    const updated = staff.filter((s) => s.id !== id);
    setStaff(updated);
    localStorage.setItem('kb_faculty', JSON.stringify(updated));
    await deleteDocFromCloud(COLLECTIONS.STAFF, id);
    showToast('Faculty profile removed.');
  };

  // Add Topper
  const handleAddTopper = async (e) => {
    e.preventDefault();
    if (!newTopper.name || !newTopper.percentage) {
      alert('Please enter student name and percentage/score.');
      return;
    }
    const item = {
      ...newTopper,
      id: 'top-' + Date.now(),
      image: newTopper.image || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80'
    };
    const updated = [item, ...toppers];
    setToppers(updated);
    localStorage.setItem('kb_toppers', JSON.stringify(updated));
    await syncCollectionToCloud(COLLECTIONS.TOPPERS, updated);
    setNewTopper({
      name: '',
      classLevel: 'Class 12th Board',
      stream: 'Science (Non-Medical)',
      percentage: '',
      rank: 'HPBOSE Merit Holder',
      year: '2025',
      image: ''
    });
    showToast('Board Topper added to Honours Spotlight!');
  };

  const handleDeleteTopper = async (id) => {
    const updated = toppers.filter((t) => t.id !== id);
    setToppers(updated);
    localStorage.setItem('kb_toppers', JSON.stringify(updated));
    await deleteDocFromCloud(COLLECTIONS.TOPPERS, id);
    showToast('Topper card removed.');
  };

  // Add Gallery Photo
  const handleAddPhoto = async (e) => {
    e.preventDefault();
    if (!newPhoto.title || !newPhoto.image) {
      alert('Please enter a caption and upload a photo.');
      return;
    }
    const item = { ...newPhoto, id: 'gal-' + Date.now() };
    const updated = [item, ...gallery];
    setGallery(updated);
    localStorage.setItem('kb_gallery', JSON.stringify(updated));
    await syncCollectionToCloud(COLLECTIONS.GALLERY, updated);
    setNewPhoto({ title: '', category: 'Campus & Infrastructure', date: '2026', image: '' });
    showToast('Photo published to Campus Gallery!');
  };

  const handleDeletePhoto = async (id) => {
    const updated = gallery.filter((g) => g.id !== id);
    setGallery(updated);
    localStorage.setItem('kb_gallery', JSON.stringify(updated));
    await deleteDocFromCloud(COLLECTIONS.GALLERY, id);
    showToast('Gallery photo removed.');
  };

  // Update Enquiry Status
  const handleEnquiryStatus = async (id, status) => {
    const updated = enquiries.map((eq) => (eq.id === id ? { ...eq, status } : eq));
    setEnquiries(updated);
    localStorage.setItem('kb_enquiries', JSON.stringify(updated));
    await syncCollectionToCloud(COLLECTIONS.ENQUIRIES, updated);
    showToast(`Enquiry marked as "${status}".`);
  };

  const handleDeleteEnquiry = async (id) => {
    const updated = enquiries.filter((eq) => eq.id !== id);
    setEnquiries(updated);
    localStorage.setItem('kb_enquiries', JSON.stringify(updated));
    await deleteDocFromCloud(COLLECTIONS.ENQUIRIES, id);
    showToast('Enquiry deleted.');
  };

  const handleSyncAllToCloud = async () => {
    setIsSyncingAll(true);
    try {
      await saveSchoolConfigToCloud(settings);
      await syncCollectionToCloud(COLLECTIONS.HERO, heroSlides);
      await syncCollectionToCloud(COLLECTIONS.NOTICES, notices);
      await syncCollectionToCloud(COLLECTIONS.STAFF, staff);
      await syncCollectionToCloud(COLLECTIONS.TOPPERS, toppers);
      await syncCollectionToCloud(COLLECTIONS.GALLERY, gallery);
      await syncCollectionToCloud(COLLECTIONS.ENQUIRIES, enquiries);
      showToast('All school records successfully synchronized with Google Cloud Firestore!');
    } catch (err) {
      alert('Cloud sync notice: ' + err.message);
    } finally {
      setIsSyncingAll(false);
    }
  };

  return (
    <div className="kb-admin-fullscreen">
      {/* 1. Full-Width Top Header */}
      <div className="kb-admin-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <SchoolCrestLogo logoUrl={settings.logoUrl} schoolName={settings.schoolName} size={48} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  background: 'linear-gradient(135deg, var(--brand-orange), var(--brand-orange-dark))',
                  color: '#fff',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  boxShadow: '0 2px 8px rgba(34, 197, 94, 0.25)'
                }}
              >
                ADMIN DASHBOARD
              </span>
              <span style={{ fontSize: '0.86rem', color: 'var(--royal-blue)', fontWeight: 800 }}>
                {settings.schoolName} {settings.subName}
              </span>
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              HPBSE Affiliation: {settings.affiliationNo} • Bijhari, Hamirpur (H.P.)
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onClose}
            className="btn-royal-outline"
            style={{
              padding: '8px 18px',
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderColor: 'var(--border-light)'
            }}
          >
            <X size={16} />
            <span>Exit Admin Panel</span>
          </button>
        </div>
      </div>

      {/* Status Toast Banner */}
      {statusBanner && (
        <div
          style={{
            background: '#ecfdf5',
            borderBottom: '1px solid #10b981',
            color: '#065f46',
            padding: '12px 32px',
            fontSize: '0.92rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <CheckCircle2 size={20} />
          {statusBanner}
        </div>
      )}

      {!isAuthenticated ? (
        /* PIN Login Screen */
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', background: '#fafdfb' }}>
          <div style={{ maxWidth: 440, width: '100%', background: '#ffffff', border: '1.5px solid rgba(34, 197, 94, 0.25)', borderRadius: '20px', padding: '38px', boxShadow: 'var(--shadow-md)', textAlign: 'center' }}>
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: '50%',
                background: '#f0fdf4',
                border: '2px solid var(--brand-orange)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px',
                color: 'var(--brand-orange-dark)'
              }}
            >
              <Lock size={30} />
            </div>
            <h2 style={{ fontSize: '1.65rem', marginBottom: '6px', color: 'var(--text-heading)', fontWeight: 800 }}>
              Staff & Admin Portal
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.5 }}>
              Enter administrator PIN to manage school logo, contact numbers, HPBSE toppers, notices, banners and admission leads.
            </p>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input
                type="password"
                className="kb-input"
                placeholder="Enter Admin Security PIN"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                style={{ textAlign: 'center', fontSize: '1.15rem', fontWeight: 800, padding: '13px' }}
                autoFocus
              />
              {pinError && (
                <div style={{ color: '#dc2626', fontSize: '0.86rem', fontWeight: 700 }}>{pinError}</div>
              )}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="btn-royal-primary"
                style={{ width: '100%', padding: '13px', fontSize: '0.96rem', opacity: isLoggingIn ? 0.8 : 1 }}
              >
                <ShieldCheck size={19} />
                <span>{isLoggingIn ? 'Verifying with Google Cloud...' : 'Unlock Admin Dashboard'}</span>
              </button>
              <div
                style={{
                  marginTop: '8px',
                  padding: '12px',
                  borderRadius: '10px',
                  background: '#f0fdf4',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  fontSize: '0.8rem',
                  color: 'var(--brand-orange-dark)',
                  lineHeight: 1.5
                }}
              >
                🔒 Protected by Google Cloud Firestore live verification.
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* Authenticated 2-Column Full Screen View */
        <div className="kb-admin-body">
          {/* Left Large Sidebar */}
          <div className="kb-admin-sidebar">
            <div style={{ fontSize: '0.74rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0 12px 6px', letterSpacing: '0.06em' }}>
              Management Sections
            </div>
            {[
              { id: 'settings', label: 'School Identity & Contact Info', icon: Settings },
              { id: 'security', label: 'Admin Security & Change PIN', icon: Key },
              { id: 'hero', label: `Hero Image Carousel (${heroSlides.length})`, icon: ImageIcon },
              { id: 'notices', label: `Notices & Circulars (${notices.length})`, icon: Bell },
              { id: 'enquiries', label: `Admission Leads (${enquiries.length})`, icon: Inbox },
              { id: 'toppers', label: `HPBSE Board Toppers (${toppers.length})`, icon: Award },
              { id: 'staff', label: `Faculty Directory (${staff.length})`, icon: Users },
              { id: 'gallery', label: `Campus Photo Gallery (${gallery.length})`, icon: Camera },
              { id: 'cloud', label: 'Cloud Sync & Backup', icon: Cloud }
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    textAlign: 'left',
                    background: active ? '#f0fdf4' : '#ffffff',
                    color: active ? 'var(--brand-orange-dark)' : 'var(--text-heading)',
                    border: '1.5px solid',
                    borderColor: active ? 'var(--brand-orange)' : 'var(--border-light)',
                    transition: 'var(--transition)',
                    cursor: 'pointer',
                    boxShadow: active ? '0 4px 14px rgba(34, 197, 94, 0.15)' : 'none'
                  }}
                >
                  <Icon size={18} color={active ? 'var(--brand-orange-dark)' : 'var(--text-muted)'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '2px solid var(--border-light)' }}>
              <button
                onClick={() => {
                  if (window.confirm('Reset all demo content to original Kid Buds Bijhari defaults?')) {
                    onResetDefaults();
                    showToast('Default school data restored!');
                  }
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '11px',
                  borderRadius: '12px',
                  background: '#ffffff',
                  border: '1.5px solid var(--border-light)',
                  color: 'var(--text-muted)',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                <RotateCcw size={15} /> Reset Demo Content
              </button>
            </div>
          </div>

          {/* Right Wide Workspace Pane */}
          <div className="kb-admin-content-pane">
              {/* TAB 1: SITE SETTINGS, LOGO & CONTACT DETAILS */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.35rem' }}>School Logo, Branding & Contact Details</h3>
                      <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                        Update the school logo, phone numbers, email, Bijhari campus address, and Principal’s profile anytime.
                      </p>
                    </div>
                    <button type="submit" className="btn-royal-primary">
                      <Save size={17} /> Save All Changes
                    </button>
                  </div>

                  {/* Logo Upload Card */}
                  <div
                    style={{
                      background: '#f0fdf4',
                      border: '1.5px solid rgba(34, 197, 94, 0.28)',
                      borderRadius: '16px',
                      padding: '22px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '22px',
                      flexWrap: 'wrap'
                    }}
                  >
                    <SchoolCrestLogo logoUrl={draftSettings.logoUrl} schoolName={draftSettings.schoolName} size={78} />
                    <div style={{ flex: 1, minWidth: 240 }}>
                      <h4 style={{ fontSize: '1.05rem', marginBottom: '4px', color: 'var(--text-heading)' }}>Official School Logo</h4>
                      <p style={{ fontSize: '0.84rem', color: 'var(--text-body)', marginBottom: '12px' }}>
                        Upload your School Logo (automatically compressed to clean, ultra-fast WebP) or leave blank to use the official crest.
                      </p>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <label
                          className="btn-royal-primary"
                          style={{ padding: '8px 16px', fontSize: '0.82rem', cursor: 'pointer' }}
                        >
                          <Upload size={15} />
                          {isUploading ? 'Optimizing...' : 'Upload New Logo File'}
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) =>
                              handlePhotoUpload(e.target.files?.[0], 'school_logo', (url) =>
                                setDraftSettings({ ...draftSettings, logoUrl: url })
                              )
                            }
                          />
                        </label>
                        {draftSettings.logoUrl && (
                          <button
                            type="button"
                            className="btn-royal-outline"
                            style={{ padding: '7px 14px', fontSize: '0.8rem' }}
                            onClick={() => setDraftSettings({ ...draftSettings, logoUrl: '' })}
                          >
                            Reset to Default Crest
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Identity & Affiliation Grid */}
                  <div className="kb-royal-card" style={{ padding: '24px' }}>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: '16px', color: 'var(--royal-blue)' }}>
                      1. School Identity & HPBSE Affiliation
                    </h4>
                    <div className="kb-grid-2" style={{ gap: '16px' }}>
                      <div>
                        <label className="kb-label">Full School Name</label>
                        <input
                          className="kb-input"
                          value={draftSettings.schoolName}
                          onChange={(e) => setDraftSettings({ ...draftSettings, schoolName: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="kb-label">Location Subtitle</label>
                        <input
                          className="kb-input"
                          value={draftSettings.locationShort}
                          onChange={(e) => setDraftSettings({ ...draftSettings, locationShort: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="kb-label">Board Affiliation Line</label>
                        <input
                          className="kb-input"
                          value={draftSettings.boardAffiliation}
                          onChange={(e) => setDraftSettings({ ...draftSettings, boardAffiliation: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="kb-label">Affiliation No. / School Code</label>
                        <input
                          className="kb-input"
                          value={draftSettings.affiliationNo}
                          onChange={(e) => setDraftSettings({ ...draftSettings, affiliationNo: e.target.value })}
                        />
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label className="kb-label">Top Scrolling Announcement Ticker Text</label>
                        <input
                          className="kb-input"
                          value={draftSettings.topAnnouncement}
                          onChange={(e) => setDraftSettings({ ...draftSettings, topAnnouncement: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Details Card */}
                  <div className="kb-royal-card" style={{ padding: '24px' }}>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: '16px', color: 'var(--royal-blue)' }}>
                      2. Contact Numbers, WhatsApp, Email & Campus Address
                    </h4>
                    <div className="kb-grid-2" style={{ gap: '16px' }}>
                      <div>
                        <label className="kb-label">Primary Phone Number (Reception / Admissions)</label>
                        <input
                          className="kb-input"
                          value={draftSettings.phonePrimary}
                          onChange={(e) => setDraftSettings({ ...draftSettings, phonePrimary: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="kb-label">Secondary / Office Landline Number</label>
                        <input
                          className="kb-input"
                          value={draftSettings.phoneSecondary}
                          onChange={(e) => setDraftSettings({ ...draftSettings, phoneSecondary: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="kb-label">WhatsApp Number (e.g. 919816245000)</label>
                        <input
                          className="kb-input"
                          value={draftSettings.whatsappNumber}
                          onChange={(e) => setDraftSettings({ ...draftSettings, whatsappNumber: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="kb-label">Official School Email ID</label>
                        <input
                          className="kb-input"
                          value={draftSettings.email}
                          onChange={(e) => setDraftSettings({ ...draftSettings, email: e.target.value })}
                        />
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label className="kb-label">School Office Timings</label>
                        <input
                          className="kb-input"
                          value={draftSettings.officeTimings}
                          onChange={(e) => setDraftSettings({ ...draftSettings, officeTimings: e.target.value })}
                        />
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label className="kb-label">Full Campus Address</label>
                        <input
                          className="kb-input"
                          value={draftSettings.address}
                          onChange={(e) => setDraftSettings({ ...draftSettings, address: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Principal Profile Card */}
                  <div className="kb-royal-card" style={{ padding: '22px' }}>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: '16px', color: 'var(--royal-blue)' }}>
                      3. Principal’s Profile & Desk Message
                    </h4>
                    <div className="kb-grid-2" style={{ gap: '16px' }}>
                      <div>
                        <label className="kb-label">Principal Name</label>
                        <input
                          className="kb-input"
                          value={draftSettings.principalName}
                          onChange={(e) => setDraftSettings({ ...draftSettings, principalName: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="kb-label">Qualifications & Experience</label>
                        <input
                          className="kb-input"
                          value={draftSettings.principalQualification}
                          onChange={(e) =>
                            setDraftSettings({ ...draftSettings, principalQualification: e.target.value })
                          }
                        />
                      </div>
                      <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <img
                          src={draftSettings.principalPhoto}
                          alt="Principal"
                          style={{ width: 64, height: 64, borderRadius: '12px', objectFit: 'cover' }}
                        />
                        <label className="btn-royal-outline" style={{ padding: '8px 14px', fontSize: '0.8rem', cursor: 'pointer' }}>
                          <Upload size={14} /> Upload Principal Photo
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) =>
                              handlePhotoUpload(e.target.files?.[0], 'principal', (url) =>
                                setDraftSettings({ ...draftSettings, principalPhoto: url })
                              )
                            }
                          />
                        </label>
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label className="kb-label">Principal’s Message to Parents & Students</label>
                        <textarea
                          rows={4}
                          className="kb-textarea"
                          value={draftSettings.principalMessage}
                          onChange={(e) => setDraftSettings({ ...draftSettings, principalMessage: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn-royal-primary">
                      <Save size={18} /> Save & Publish Settings
                    </button>
                  </div>
                </form>
              )}

              {/* TAB: ADMIN SECURITY & PIN MANAGEMENT */}
              {activeTab === 'security' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', color: 'var(--royal-blue)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Lock size={22} color="var(--brand-orange)" />
                      Admin Security & Access PIN
                    </h3>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                      Manage your administrative login credentials, update your password/PIN anytime, and view the Cloud recovery plan.
                    </p>
                  </div>

                  {/* Form Card: Change PIN */}
                  <div
                    style={{
                      background: '#ffffff',
                      border: '1.5px solid var(--border-light)',
                      borderRadius: '16px',
                      padding: '28px',
                      boxShadow: '0 4px 16px rgba(13, 39, 87, 0.05)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: '10px',
                          background: 'var(--royal-blue-light)',
                          color: 'var(--royal-blue)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Key size={22} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.1rem', margin: 0 }}>Change Administrator PIN / Password</h4>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Changes take effect immediately across all devices via Google Cloud Firestore.
                        </div>
                      </div>
                    </div>

                    {pinChangeMsg.text && (
                      <div
                        style={{
                          marginBottom: '20px',
                          padding: '12px 16px',
                          borderRadius: '10px',
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          background: pinChangeMsg.type === 'error' ? '#fef2f2' : '#ecfdf5',
                          border: `1px solid ${pinChangeMsg.type === 'error' ? '#f87171' : '#34d399'}`,
                          color: pinChangeMsg.type === 'error' ? '#b91c1c' : '#065f46'
                        }}
                      >
                        {pinChangeMsg.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
                        <span>{pinChangeMsg.text}</span>
                      </div>
                    )}

                    <form onSubmit={handleChangePin} style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: 520 }}>
                      <div>
                        <label className="kb-label">Current Admin PIN *</label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type={showPinState.current ? 'text' : 'password'}
                            className="kb-input"
                            placeholder="Enter your current PIN"
                            value={pinChangeForm.currentPin}
                            onChange={(e) => setPinChangeForm({ ...pinChangeForm, currentPin: e.target.value })}
                            required
                            style={{ paddingRight: '42px' }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPinState({ ...showPinState, current: !showPinState.current })}
                            style={{
                              position: 'absolute',
                              right: 12,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'transparent',
                              color: '#64748b'
                            }}
                            title={showPinState.current ? 'Hide PIN' : 'Show PIN'}
                          >
                            {showPinState.current ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label className="kb-label">New Admin PIN * (Min 6 chars)</label>
                          <div style={{ position: 'relative' }}>
                            <input
                              type={showPinState.new ? 'text' : 'password'}
                              className="kb-input"
                              placeholder="New Secure PIN"
                              value={pinChangeForm.newPin}
                              onChange={(e) => setPinChangeForm({ ...pinChangeForm, newPin: e.target.value })}
                              required
                              minLength={6}
                              style={{ paddingRight: '42px' }}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPinState({ ...showPinState, new: !showPinState.new })}
                              style={{
                                position: 'absolute',
                                right: 12,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'transparent',
                                color: '#64748b'
                              }}
                              title={showPinState.new ? 'Hide PIN' : 'Show PIN'}
                            >
                              {showPinState.new ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="kb-label">Confirm New PIN *</label>
                          <div style={{ position: 'relative' }}>
                            <input
                              type={showPinState.confirm ? 'text' : 'password'}
                              className="kb-input"
                              placeholder="Re-type New PIN"
                              value={pinChangeForm.confirmPin}
                              onChange={(e) => setPinChangeForm({ ...pinChangeForm, confirmPin: e.target.value })}
                              required
                              minLength={6}
                              style={{ paddingRight: '42px' }}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPinState({ ...showPinState, confirm: !showPinState.confirm })}
                              style={{
                                position: 'absolute',
                                right: 12,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'transparent',
                                color: '#64748b'
                              }}
                              title={showPinState.confirm ? 'Hide PIN' : 'Show PIN'}
                            >
                              {showPinState.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                        <button type="submit" className="btn-royal-primary" style={{ background: 'var(--brand-orange)', padding: '12px 24px' }}>
                          <ShieldCheck size={18} /> Update PIN & Save to Cloud
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Security & Recovery Plan Card */}
                  <div
                    style={{
                      background: '#f0fdf4',
                      border: '1.5px solid rgba(34, 197, 94, 0.28)',
                      borderRadius: '16px',
                      padding: '24px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      <HelpCircle size={22} color="var(--brand-orange-dark)" />
                      <h4 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--text-heading)' }}>
                        Security Plan & Emergency Password Recovery
                      </h4>
                    </div>

                    <p style={{ fontSize: '0.88rem', color: 'var(--text-heading)', lineHeight: 1.6, marginBottom: '16px' }}>
                      If the school administration ever forgets the updated Admin Password/PIN, you can easily recover or reset it anytime:
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                      <div style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-heading)', marginBottom: '6px' }}>
                          1. Direct Reset via Firebase Console (100% Guaranteed)
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                          Your PIN is securely stored in <strong>Google Firebase Firestore</strong>. You can view or reset it anytime by opening <code>console.firebase.google.com</code> &gt; <strong>kidbud-3203e &gt; Firestore Database &gt; kb_school_config &gt; main_settings &gt; adminPin</strong> without needing any code modifications.
                        </div>
                      </div>

                      <div style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--brand-orange-dark)', marginBottom: '6px' }}>
                          2. Zero Data Loss Security
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                          Changing or recovering the PIN never impacts any school circulars, toppers, faculty records, or admission enquiries. All school records remain permanently protected in Google Cloud.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: HERO BANNERS */}
              {activeTab === 'hero' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem' }}>Homepage Hero Slider Manager</h3>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                      Add or update the large bright showcase banners on the homepage.
                    </p>
                  </div>

                  <form onSubmit={handleAddSlide} className="kb-royal-card" style={{ background: 'var(--bg-ivory)' }}>
                    <h4 style={{ fontSize: '1rem', marginBottom: '14px', color: 'var(--royal-blue)' }}>
                      + Add New Hero Slide
                    </h4>
                    <div className="kb-grid-2" style={{ gap: '14px' }}>
                      <div>
                        <label className="kb-label">Slide Headline</label>
                        <input
                          className="kb-input"
                          placeholder="e.g. Admissions Open for Session 2026–27"
                          value={newSlide.title}
                          onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="kb-label">Top Badge Text</label>
                        <input
                          className="kb-input"
                          value={newSlide.badge}
                          onChange={(e) => setNewSlide({ ...newSlide, badge: e.target.value })}
                        />
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label className="kb-label">Subtitle / Description</label>
                        <input
                          className="kb-input"
                          placeholder="Short inspiring description..."
                          value={newSlide.subtitle}
                          onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="kb-label">Upload Banner Photo or Paste URL</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input
                            className="kb-input"
                            placeholder="Image URL or upload file ->"
                            value={newSlide.image}
                            onChange={(e) => setNewSlide({ ...newSlide, image: e.target.value })}
                          />
                          <label className="btn-royal-outline" style={{ padding: '8px 14px', cursor: 'pointer', flexShrink: 0 }}>
                            <Upload size={15} /> Upload
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={(e) =>
                                handlePhotoUpload(e.target.files?.[0], 'hero', (url) =>
                                  setNewSlide({ ...newSlide, image: url })
                                )
                              }
                            />
                          </label>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button type="submit" className="btn-royal-primary" style={{ width: '100%' }}>
                          <Plus size={17} /> Publish Hero Slide
                        </button>
                      </div>
                    </div>
                  </form>

                  <div className="kb-grid-2" style={{ gap: '16px' }}>
                    {heroSlides.map((slide) => (
                      <div key={slide.id} className="kb-royal-card" style={{ padding: '16px' }}>
                        <img
                          src={slide.image}
                          alt={slide.title}
                          style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: '12px', marginBottom: '12px' }}
                        />
                        <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--royal-gold-dark)' }}>
                          {slide.badge}
                        </div>
                        <h4 style={{ fontSize: '1.02rem', margin: '4px 0 6px' }}>{slide.title}</h4>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                          {slide.subtitle}
                        </p>
                        <button
                          onClick={() => handleDeleteSlide(slide.id)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            background: '#fef2f2',
                            color: '#dc2626',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            fontWeight: 700
                          }}
                        >
                          <Trash2 size={14} /> Remove Slide
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: NOTICES & CIRCULARS */}
              {activeTab === 'notices' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem' }}>Live Notice Board & Circulars Manager</h3>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                      Post instant notices, HPBOSE date sheets, holiday alerts, and admission updates for parents.
                    </p>
                  </div>

                  <form onSubmit={handleAddNotice} className="kb-royal-card" style={{ background: 'var(--bg-ivory)' }}>
                    <h4 style={{ fontSize: '1rem', marginBottom: '14px', color: 'var(--royal-blue)' }}>
                      + Post New Notice / Circular
                    </h4>
                    <div className="kb-grid-2" style={{ gap: '14px' }}>
                      <div>
                        <label className="kb-label">Notice Headline</label>
                        <input
                          className="kb-input"
                          placeholder="e.g. Parent Teacher Meeting on Saturday"
                          value={newNotice.title}
                          onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                          <label className="kb-label">Category</label>
                          <select
                            className="kb-select"
                            value={newNotice.category}
                            onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value })}
                          >
                            <option value="Admission">Admission</option>
                            <option value="Examination">Examination / Date Sheet</option>
                            <option value="Circular">Circular</option>
                            <option value="Achievement">Achievement</option>
                            <option value="Holiday">Holiday / Event</option>
                          </select>
                        </div>
                        <div>
                          <label className="kb-label">Date</label>
                          <input
                            type="date"
                            className="kb-input"
                            value={newNotice.date}
                            onChange={(e) => setNewNotice({ ...newNotice, date: e.target.value })}
                          />
                        </div>
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label className="kb-label">Full Notice Details</label>
                        <textarea
                          rows={3}
                          className="kb-textarea"
                          placeholder="Write complete circular details for parents and students..."
                          value={newNotice.summary}
                          onChange={(e) => setNewNotice({ ...newNotice, summary: e.target.value })}
                        />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                          type="checkbox"
                          id="impNotice"
                          checked={newNotice.isImportant}
                          onChange={(e) => setNewNotice({ ...newNotice, isImportant: e.target.checked })}
                        />
                        <label htmlFor="impNotice" style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                          Highlight as "Important / Pin to Top Notice Board"
                        </label>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" className="btn-royal-primary">
                          <Plus size={17} /> Publish Notice
                        </button>
                      </div>
                    </div>
                  </form>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {notices.map((n) => (
                      <div
                        key={n.id}
                        className="kb-royal-card"
                        style={{
                          padding: '16px 20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '16px'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                padding: '2px 9px',
                                borderRadius: '999px',
                                background: '#f0fdf4',
                                color: 'var(--brand-orange-dark)',
                                border: '1px solid rgba(34, 197, 94, 0.25)'
                              }}
                            >
                              {n.category}
                            </span>
                            {n.isImportant && (
                              <span
                                style={{
                                  fontSize: '0.7rem',
                                  fontWeight: 800,
                                  padding: '2px 8px',
                                  borderRadius: '999px',
                                  background: '#dcfce7',
                                  color: '#15803d'
                                }}
                              >
                                IMPORTANT
                              </span>
                            )}
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{n.date}</span>
                          </div>
                          <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>{n.title}</h4>
                          <p style={{ fontSize: '0.84rem', color: 'var(--text-body)' }}>{n.summary}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteNotice(n.id)}
                          style={{
                            background: '#fef2f2',
                            color: '#dc2626',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            flexShrink: 0
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: ADMISSION ENQUIRIES INBOX */}
              {activeTab === 'enquiries' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem' }}>Admission & Parent Enquiries Inbox ({enquiries.length})</h3>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                      Every online admission form submitted by parents is saved here. Call or WhatsApp parents with one click.
                    </p>
                  </div>

                  {enquiries.length === 0 ? (
                    <div className="kb-royal-card" style={{ textAlign: 'center', padding: '40px' }}>
                      No admission enquiries yet.
                    </div>
                  ) : (
                    enquiries.map((eq) => (
                      <div key={eq.id} className="kb-royal-card" style={{ padding: '20px' }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '12px',
                            marginBottom: '12px'
                          }}
                        >
                          <div>
                            <span
                              style={{
                                display: 'inline-block',
                                fontSize: '0.74rem',
                                fontWeight: 800,
                                padding: '3px 10px',
                                borderRadius: '999px',
                                background: eq.status === 'Admitted' ? '#dcfce7' : 'var(--bg-gold-tint)',
                                color: eq.status === 'Admitted' ? '#166534' : 'var(--royal-gold-dark)',
                                marginBottom: '6px'
                              }}
                            >
                              Status: {eq.status || 'New'} • Applying for: {eq.applyingForClass}
                            </span>
                            <h4 style={{ fontSize: '1.12rem' }}>
                              Student: {eq.studentName}{' '}
                              <span style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                                (Parent: {eq.parentName})
                              </span>
                            </h4>
                            <div style={{ fontSize: '0.84rem', color: 'var(--text-body)', marginTop: '4px' }}>
                              Phone: <strong>{eq.phone}</strong> • Location: <strong>{eq.villageCity || 'Hamirpur'}</strong>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <a
                              href={`tel:${eq.phone}`}
                              className="btn-royal-outline"
                              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                            >
                              <Phone size={14} /> Call
                            </a>
                            <a
                              href={`https://wa.me/91${eq.phone.replace(/\D/g, '').slice(-10)}?text=${encodeURIComponent(
                                `Greetings from Kid Buds Public Senior Secondary School, Bijhari! Regarding admission enquiry for ${eq.studentName} (${eq.applyingForClass}).`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="btn-royal-primary"
                              style={{ padding: '6px 12px', fontSize: '0.78rem', background: '#16a34a' }}
                            >
                              <MessageSquare size={14} /> WhatsApp
                            </a>
                            <select
                              className="kb-select"
                              style={{ width: 'auto', padding: '6px 10px', fontSize: '0.78rem', fontWeight: 700 }}
                              value={eq.status || 'New'}
                              onChange={(e) => handleEnquiryStatus(eq.id, e.target.value)}
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Campus Visited">Campus Visited</option>
                              <option value="Admitted">Admitted</option>
                            </select>
                            <button
                              onClick={() => handleDeleteEnquiry(eq.id)}
                              style={{
                                background: '#fef2f2',
                                color: '#dc2626',
                                padding: '6px 10px',
                                borderRadius: '8px'
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        {eq.message && (
                          <div
                            style={{
                              background: 'var(--bg-ivory)',
                              padding: '10px 14px',
                              borderRadius: '10px',
                              fontSize: '0.85rem'
                            }}
                          >
                            “{eq.message}”
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 5: FACULTY & STAFF MANAGER */}
              {activeTab === 'staff' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem' }}>Faculty & Staff Directory Manager</h3>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                      Add or update teachers, coordinators, and administrative leadership.
                    </p>
                  </div>

                  <form onSubmit={handleAddStaff} className="kb-royal-card" style={{ background: 'var(--bg-ivory)' }}>
                    <h4 style={{ fontSize: '1rem', marginBottom: '14px', color: 'var(--royal-blue)' }}>
                      + Add Faculty Member
                    </h4>
                    <div className="kb-grid-2" style={{ gap: '14px' }}>
                      <div>
                        <label className="kb-label">Teacher Full Name</label>
                        <input
                          className="kb-input"
                          placeholder="e.g. Mr. Rajesh Thakur"
                          value={newStaff.name}
                          onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="kb-label">Designation / Role</label>
                        <input
                          className="kb-input"
                          placeholder="e.g. PGT Physics / Senior Coordinator"
                          value={newStaff.designation}
                          onChange={(e) => setNewStaff({ ...newStaff, designation: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="kb-label">Wing / Department</label>
                        <select
                          className="kb-select"
                          value={newStaff.department}
                          onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })}
                        >
                          <option value="Administration">Administration</option>
                          <option value="Senior Secondary (PGT)">Senior Secondary (PGT)</option>
                          <option value="Secondary (TGT)">Secondary (TGT)</option>
                          <option value="Primary & Pre-Primary (PRT)">Primary & Pre-Primary (PRT)</option>
                        </select>
                      </div>
                      <div>
                        <label className="kb-label">Qualifications</label>
                        <input
                          className="kb-input"
                          placeholder="e.g. M.Sc., B.Ed., HP TET"
                          value={newStaff.qualification}
                          onChange={(e) => setNewStaff({ ...newStaff, qualification: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="kb-label">Subject Specialization & Experience</label>
                        <input
                          className="kb-input"
                          placeholder="e.g. Physics (12 Years Exp.)"
                          value={newStaff.subject}
                          onChange={(e) => setNewStaff({ ...newStaff, subject: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="kb-label">Faculty Photo</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input
                            className="kb-input"
                            placeholder="Photo URL or Upload ->"
                            value={newStaff.image}
                            onChange={(e) => setNewStaff({ ...newStaff, image: e.target.value })}
                          />
                          <label className="btn-royal-outline" style={{ padding: '8px 14px', cursor: 'pointer', flexShrink: 0 }}>
                            <Upload size={15} /> Upload
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={(e) =>
                                handlePhotoUpload(e.target.files?.[0], 'staff', (url) =>
                                  setNewStaff({ ...newStaff, image: url })
                                )
                              }
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'flex-end' }}>
                      <button type="submit" className="btn-royal-primary">
                        <Plus size={17} /> Add Faculty Member
                      </button>
                    </div>
                  </form>

                  <div className="kb-grid-2" style={{ gap: '14px' }}>
                    {staff.map((st) => (
                      <div
                        key={st.id}
                        className="kb-royal-card"
                        style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '14px' }}
                      >
                        <img
                          src={st.image}
                          alt={st.name}
                          style={{ width: 62, height: 62, borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.73rem', fontWeight: 800, color: 'var(--royal-gold-dark)' }}>
                            {st.department}
                          </div>
                          <h4 style={{ fontSize: '1rem' }}>{st.name}</h4>
                          <div style={{ fontSize: '0.82rem', color: 'var(--royal-blue)', fontWeight: 600 }}>
                            {st.designation} • {st.qualification}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteStaff(st.id)}
                          style={{
                            background: '#fef2f2',
                            color: '#dc2626',
                            padding: '8px',
                            borderRadius: '8px'
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: BOARD TOPPERS */}
              {activeTab === 'toppers' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem' }}>HPBOSE Board Toppers & Merit Holders</h3>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                      Showcase Class 10th & 12th Board merit holders, Olympiad winners, and state rankers.
                    </p>
                  </div>

                  <form onSubmit={handleAddTopper} className="kb-royal-card" style={{ background: 'var(--bg-ivory)' }}>
                    <h4 style={{ fontSize: '1rem', marginBottom: '14px', color: 'var(--royal-blue)' }}>
                      + Add Board Topper / Achiever
                    </h4>
                    <div className="kb-grid-2" style={{ gap: '14px' }}>
                      <div>
                        <label className="kb-label">Student Name</label>
                        <input
                          className="kb-input"
                          placeholder="e.g. Priyanshu Sharma"
                          value={newTopper.name}
                          onChange={(e) => setNewTopper({ ...newTopper, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="kb-label">Percentage / Score</label>
                        <input
                          className="kb-input"
                          placeholder="e.g. 98.2%"
                          value={newTopper.percentage}
                          onChange={(e) => setNewTopper({ ...newTopper, percentage: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="kb-label">Category / Board Class</label>
                        <select
                          className="kb-select"
                          value={newTopper.classLevel}
                          onChange={(e) => setNewTopper({ ...newTopper, classLevel: e.target.value })}
                        >
                          <option value="Class 12th Board">Class 12th Board</option>
                          <option value="Class 10th Board">Class 10th Board</option>
                          <option value="Olympiad & Sports">Olympiad & Sports</option>
                        </select>
                      </div>
                      <div>
                        <label className="kb-label">Stream / Merit Rank Highlight</label>
                        <input
                          className="kb-input"
                          placeholder="e.g. State Merit Rank 4 (Science)"
                          value={newTopper.rank}
                          onChange={(e) => setNewTopper({ ...newTopper, rank: e.target.value })}
                        />
                      </div>
                      <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input
                          className="kb-input"
                          placeholder="Student Photo URL or upload file ->"
                          value={newTopper.image}
                          onChange={(e) => setNewTopper({ ...newTopper, image: e.target.value })}
                        />
                        <label className="btn-royal-outline" style={{ padding: '10px 16px', cursor: 'pointer', flexShrink: 0 }}>
                          <Upload size={15} /> Upload Photo
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) =>
                              handlePhotoUpload(e.target.files?.[0], 'toppers', (url) =>
                                setNewTopper({ ...newTopper, image: url })
                              )
                            }
                          />
                        </label>
                        <button type="submit" className="btn-royal-primary" style={{ flexShrink: 0 }}>
                          <Plus size={17} /> Add Topper
                        </button>
                      </div>
                    </div>
                  </form>

                  <div className="kb-grid-3" style={{ gap: '14px' }}>
                    {toppers.map((t) => (
                      <div key={t.id} className="kb-royal-card" style={{ padding: '16px', textAlign: 'center' }}>
                        <img
                          src={t.image}
                          alt={t.name}
                          style={{
                            width: 72,
                            height: 72,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            margin: '0 auto 10px',
                            border: '2px solid var(--royal-gold)'
                          }}
                        />
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--royal-blue)' }}>
                          {t.percentage}
                        </div>
                        <h4 style={{ fontSize: '1rem' }}>{t.name}</h4>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                          {t.classLevel} • {t.rank}
                        </div>
                        <button
                          onClick={() => handleDeleteTopper(t.id)}
                          style={{
                            background: '#fef2f2',
                            color: '#dc2626',
                            padding: '5px 12px',
                            borderRadius: '8px',
                            fontSize: '0.76rem',
                            fontWeight: 700
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: PHOTO GALLERY */}
              {activeTab === 'gallery' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem' }}>Campus Life & Event Photo Gallery</h3>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                      Upload high-resolution photos of school functions, labs, classrooms, and sports events.
                    </p>
                  </div>

                  <form onSubmit={handleAddPhoto} className="kb-royal-card" style={{ background: 'var(--bg-ivory)' }}>
                    <h4 style={{ fontSize: '1rem', marginBottom: '14px', color: 'var(--royal-blue)' }}>
                      + Upload Event / Campus Photo
                    </h4>
                    <div className="kb-grid-2" style={{ gap: '14px' }}>
                      <div>
                        <label className="kb-label">Photo Title / Caption</label>
                        <input
                          className="kb-input"
                          placeholder="e.g. Annual Prize Distribution Function"
                          value={newPhoto.title}
                          onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="kb-label">Album Category</label>
                        <select
                          className="kb-select"
                          value={newPhoto.category}
                          onChange={(e) => setNewPhoto({ ...newPhoto, category: e.target.value })}
                        >
                          <option value="Campus & Infrastructure">Campus & Infrastructure</option>
                          <option value="Science & Labs">Science & Labs</option>
                          <option value="Smart Classrooms">Smart Classrooms</option>
                          <option value="Annual Function">Annual Function</option>
                          <option value="Early Years (Nursery–UKG)">Early Years (Nursery–UKG)</option>
                          <option value="Sports & Athletics">Sports & Athletics</option>
                        </select>
                      </div>
                      <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px' }}>
                        <input
                          className="kb-input"
                          placeholder="Image URL or click Upload ->"
                          value={newPhoto.image}
                          onChange={(e) => setNewPhoto({ ...newPhoto, image: e.target.value })}
                        />
                        <label className="btn-royal-outline" style={{ padding: '10px 16px', cursor: 'pointer', flexShrink: 0 }}>
                          <Upload size={15} /> Upload Photo
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) =>
                              handlePhotoUpload(e.target.files?.[0], 'gallery', (url) =>
                                setNewPhoto({ ...newPhoto, image: url })
                              )
                            }
                          />
                        </label>
                        <button type="submit" className="btn-royal-primary" style={{ flexShrink: 0 }}>
                          <Plus size={17} /> Add to Gallery
                        </button>
                      </div>
                    </div>
                  </form>

                  <div className="kb-grid-3" style={{ gap: '14px' }}>
                    {gallery.map((g) => (
                      <div key={g.id} className="kb-royal-card" style={{ padding: '12px' }}>
                        <img
                          src={g.image}
                          alt={g.title}
                          style={{ width: '100%', height: 130, objectFit: 'cover', borderRadius: '10px', marginBottom: '8px' }}
                        />
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--royal-gold-dark)' }}>
                          {g.category}
                        </div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 700, marginBottom: '8px' }}>{g.title}</div>
                        <button
                          onClick={() => handleDeletePhoto(g.id)}
                          style={{
                            background: '#fef2f2',
                            color: '#dc2626',
                            padding: '5px 10px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: 700
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 8: CLOUD SYNC & FUTURE PORTAL ROADMAP */}
              {activeTab === 'cloud' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', color: 'var(--text-heading)' }}>Google Cloud Firestore & Live Sync Dashboard</h3>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                      Manage your official Google Cloud database connection, view real-time synchronization status, and trigger instantaneous cloud backups.
                    </p>
                  </div>

                  {/* Real-time Status Card */}
                  <div
                    style={{
                      background: '#f0fdf4',
                      border: '1.5px solid rgba(34, 197, 94, 0.3)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: '12px',
                            background: '#ffffff',
                            color: 'var(--brand-orange-dark)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(34, 197, 94, 0.15)'
                          }}
                        >
                          <Cloud size={24} />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
                            <h4 style={{ fontSize: '1.08rem', margin: 0, color: 'var(--text-heading)' }}>Live Cloud Firestore: Connected</h4>
                          </div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            Project: <strong>kidbud-3203e</strong> • Hosting: <strong>kidbud-3203e.web.app</strong> • 100% Free Spark Tier
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleSyncAllToCloud}
                        disabled={isSyncingAll}
                        className="btn-royal-primary"
                        style={{ padding: '10px 20px', fontSize: '0.88rem' }}
                      >
                        <Cloud size={17} />
                        {isSyncingAll ? 'Synchronizing to Cloud...' : 'Backup All Data to Cloud Now'}
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '6px' }}>
                      <div style={{ background: '#ffffff', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                        <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Database Engine</div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-heading)', marginTop: '2px' }}>Google Firestore (Live)</div>
                      </div>
                      <div style={{ background: '#ffffff', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                        <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Collections</div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-heading)', marginTop: '2px' }}>7 Collections Synced</div>
                      </div>
                      <div style={{ background: '#ffffff', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                        <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Security & Access</div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-heading)', marginTop: '2px' }}>Admin PIN Protected</div>
                      </div>
                    </div>
                  </div>

                  <div className="kb-royal-card" style={{ background: '#ffffff', border: '1.5px solid var(--border-light)' }}>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: '8px', color: 'var(--text-heading)' }}>
                      Future Portal Architecture & Expansion (Phase 2 & Phase 3 Ready)
                    </h4>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: 1.6 }}>
                      The database schema and modular React architecture are pre-structured with isolated namespaces for future school portal needs:
                    </p>
                    <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-body)', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: 1.5 }}>
                      <li>
                        <strong>Phase 1 (Active & Live):</strong> Dynamic Branding (`kb_school_config`), Hero Banners (`kb_hero_slides`), Circulars (`kb_notices`), Faculty Directory (`kb_faculty`), Board Toppers (`kb_toppers`), Campus Gallery (`kb_gallery`), Admission Leads (`kb_admission_enquiries`).
                      </li>
                      <li>
                        <strong>Phase 2 (Pre-mapped):</strong> Teacher Login & Online Exam Results Publishing (`kb_exam_results`).
                      </li>
                      <li>
                        <strong>Phase 3 (Pre-mapped):</strong> Student & Parent Portal (`kb_portal_users`), Attendance Tracking (`kb_attendance`), and Fee Management (`kb_fee_records`).
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  );
}
