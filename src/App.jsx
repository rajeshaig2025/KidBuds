// src/App.jsx
// Kid Buds Public Senior Secondary School, Bijhari (Hamirpur, H.P.)
// Affiliated to HP Board of School Education (HPBOSE), Dharamshala
// Light & Royal Theme Inspired by Oakridge International Mohali & DPS Mohali

import React, { useState, useEffect } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Award,
  BookOpen,
  Users,
  Calendar,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Lock,
  Menu,
  X,
  Send,
  GraduationCap,
  FileText,
  Camera,
  Layers,
  MonitorPlay,
  FlaskConical,
  Cpu,
  Trophy,
  Bell
} from 'lucide-react';

import SchoolCrestLogo from './components/SchoolCrestLogo';
import AdminDashboardModal from './components/AdminDashboardModal';
import MandatoryDisclosureModal from './components/MandatoryDisclosureModal';

import {
  defaultSchoolSettings,
  defaultHeroSlides,
  defaultAcademicWings,
  defaultNotices,
  defaultToppers,
  defaultStaff,
  defaultGallery,
  defaultFacilities,
  defaultEnquiries
} from './data/schoolData';

import {
  COLLECTIONS,
  fetchSchoolConfigFromCloud,
  fetchCollectionFromCloud,
  syncCollectionToCloud
} from './services/firebaseService';

export default function App() {
  // Dynamic State with Local Storage + Cloud Sync
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('kb_school_settings');
      return saved ? JSON.parse(saved) : defaultSchoolSettings;
    } catch {
      return defaultSchoolSettings;
    }
  });

  const [heroSlides, setHeroSlides] = useState(() => {
    try {
      const saved = localStorage.getItem('kb_hero_slides');
      return saved ? JSON.parse(saved) : defaultHeroSlides;
    } catch {
      return defaultHeroSlides;
    }
  });

  const [notices, setNotices] = useState(() => {
    try {
      const saved = localStorage.getItem('kb_notices');
      return saved ? JSON.parse(saved) : defaultNotices;
    } catch {
      return defaultNotices;
    }
  });

  const [staff, setStaff] = useState(() => {
    try {
      const saved = localStorage.getItem('kb_faculty');
      return saved ? JSON.parse(saved) : defaultStaff;
    } catch {
      return defaultStaff;
    }
  });

  const [toppers, setToppers] = useState(() => {
    try {
      const saved = localStorage.getItem('kb_toppers');
      return saved ? JSON.parse(saved) : defaultToppers;
    } catch {
      return defaultToppers;
    }
  });

  const [gallery, setGallery] = useState(() => {
    try {
      const saved = localStorage.getItem('kb_gallery');
      return saved ? JSON.parse(saved) : defaultGallery;
    } catch {
      return defaultGallery;
    }
  });

  const [enquiries, setEnquiries] = useState(() => {
    try {
      const saved = localStorage.getItem('kb_enquiries');
      return saved ? JSON.parse(saved) : defaultEnquiries;
    } catch {
      return defaultEnquiries;
    }
  });

  // UI Interactive States
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [activeWingId, setActiveWingId] = useState('wing-foundational');
  const [galleryFilter, setGalleryFilter] = useState('All');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isDisclosureOpen, setIsDisclosureOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Admission Form State
  const [admissionForm, setAdmissionForm] = useState({
    studentName: '',
    applyingForClass: 'Class 11th (Science - Medical)',
    parentName: '',
    phone: '',
    villageCity: '',
    message: ''
  });
  const [admissionSuccessMsg, setAdmissionSuccessMsg] = useState('');

  // Initial Cloud Load if configured
  useEffect(() => {
    async function loadCloudData() {
      try {
        const cloudConfig = await fetchSchoolConfigFromCloud();
        if (cloudConfig) setSettings(cloudConfig);

        const cloudHero = await fetchCollectionFromCloud(COLLECTIONS.HERO);
        if (cloudHero) setHeroSlides(cloudHero);

        const cloudNotices = await fetchCollectionFromCloud(COLLECTIONS.NOTICES);
        if (cloudNotices) setNotices(cloudNotices);

        const cloudStaff = await fetchCollectionFromCloud(COLLECTIONS.STAFF);
        if (cloudStaff) setStaff(cloudStaff);

        const cloudToppers = await fetchCollectionFromCloud(COLLECTIONS.TOPPERS);
        if (cloudToppers) setToppers(cloudToppers);

        const cloudGallery = await fetchCollectionFromCloud(COLLECTIONS.GALLERY);
        if (cloudGallery) setGallery(cloudGallery);

        const cloudEnquiries = await fetchCollectionFromCloud(COLLECTIONS.ENQUIRIES);
        if (cloudEnquiries) setEnquiries(cloudEnquiries);
      } catch (err) {
        console.warn('Initial cloud fetch skipped (using local storage):', err);
      }
    }
    loadCloudData();
  }, []);

  // Hero Carousel Auto-Timer
  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const activeWing = defaultAcademicWings.find((w) => w.id === activeWingId) || defaultAcademicWings[0];
  const currentHero = heroSlides[activeSlideIndex] || heroSlides[0];

  const filteredGallery =
    galleryFilter === 'All' ? gallery : gallery.filter((item) => item.category === galleryFilter);

  const galleryCategories = ['All', 'Campus & Infrastructure', 'Science & Labs', 'Smart Classrooms', 'Annual Function', 'Early Years (Nursery–UKG)', 'Sports & Athletics'];

  const handleAdmissionSubmit = async (e) => {
    e.preventDefault();
    if (!admissionForm.studentName || !admissionForm.phone) {
      alert('Please fill student name and phone number.');
      return;
    }

    const newLead = {
      ...admissionForm,
      id: 'enq-' + Date.now(),
      status: 'New',
      createdAt: new Date().toISOString()
    };

    const updated = [newLead, ...enquiries];
    setEnquiries(updated);
    localStorage.setItem('kb_enquiries', JSON.stringify(updated));
    await syncCollectionToCloud(COLLECTIONS.ENQUIRIES, updated);

    setAdmissionSuccessMsg(`Thank you! Admission enquiry for ${admissionForm.studentName} has been received. School office will contact you on ${admissionForm.phone} shortly.`);
    setAdmissionForm({
      studentName: '',
      applyingForClass: 'Class 11th (Science - Medical)',
      parentName: '',
      phone: '',
      villageCity: '',
      message: ''
    });

    setTimeout(() => setAdmissionSuccessMsg(''), 7000);
  };

  const resetAllDefaults = () => {
    setSettings(defaultSchoolSettings);
    setHeroSlides(defaultHeroSlides);
    setNotices(defaultNotices);
    setStaff(defaultStaff);
    setToppers(defaultToppers);
    setGallery(defaultGallery);
    setEnquiries(defaultEnquiries);
    localStorage.clear();
  };

  const getFacilityIcon = (iconName) => {
    switch (iconName) {
      case 'MonitorPlay': return <MonitorPlay size={24} color="var(--royal-blue)" />;
      case 'FlaskConical': return <FlaskConical size={24} color="var(--royal-blue)" />;
      case 'Cpu': return <Cpu size={24} color="var(--royal-blue)" />;
      case 'BookOpen': return <BookOpen size={24} color="var(--royal-blue)" />;
      case 'Trophy': return <Trophy size={24} color="var(--royal-blue)" />;
      default: return <ShieldCheck size={24} color="var(--royal-blue)" />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. SINGLE CLEAN HEADER (Top Ribbon Removed - Clean & Grounded) */}
      <header className="kb-header">
        <div className="kb-container kb-header-inner">
          {/* Left: School Logo & Identity */}
          <div className="kb-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <SchoolCrestLogo logoUrl={settings.logoUrl} schoolName={settings.schoolName} size={76} />
            <div className="kb-brand-block">
              <div className="kb-logo-line-1">KID BUDS</div>
              <div className="kb-logo-line-2">PUBLIC SR. SEC. SCHOOL</div>
              <div className="kb-logo-line-3">BIJHARI, HAMIRPUR • AFFILIATED TO HPBSE</div>
            </div>
          </div>

          {/* Center: 6 2026 Sleek Nav Pill Links */}
          <nav className="kb-simple-nav">
            <a href="#about" className="kb-simple-nav-link">About Us</a>
            <a href="#classes" className="kb-simple-nav-link">Classes & Streams</a>
            <a href="#faculty" className="kb-simple-nav-link">Faculty</a>
            <a href="#toppers" className="kb-simple-nav-link">Toppers</a>
            <a href="#notices" className="kb-simple-nav-link">Circulars</a>
            <a href="#gallery" className="kb-simple-nav-link">Gallery</a>
          </nav>

          {/* Right: Direct Phone Call + Modern Stylish Admission Notification Pill + Mobile Hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <a href={`tel:${settings.phonePrimary}`} className="kb-header-phone-box" title="Call School Office">
              <Phone size={14} color="var(--brand-orange)" />
              <span>{settings.phonePrimary}</span>
            </a>

            {/* Modern Animated Bell Capsule */}
            <a href="#admission" className="kb-admission-capsule" title="Admissions Open">
              <div className="kb-capsule-bell-wrap">
                <Bell size={15} className="kb-swinging-bell" />
                <span className="kb-capsule-dot" />
              </div>
              <span className="kb-capsule-text">Admissions Open</span>
            </a>

            {/* Mobile / Tablet Hamburger Button */}
            <button
              className="kb-mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Clean Mobile Slide-down Drawer */}
        {mobileMenuOpen && (
          <div className="kb-mobile-drawer">
            <a href="#about" className="kb-mobile-drawer-link" onClick={() => setMobileMenuOpen(false)}>
              <span>About Us</span>
              <ChevronRight size={16} />
            </a>
            <a href="#classes" className="kb-mobile-drawer-link" onClick={() => setMobileMenuOpen(false)}>
              <span>Classes & Streams (Nursery–12th)</span>
              <ChevronRight size={16} />
            </a>
            <a href="#faculty" className="kb-mobile-drawer-link" onClick={() => setMobileMenuOpen(false)}>
              <span>Faculty & Mentors</span>
              <ChevronRight size={16} />
            </a>
            <a href="#toppers" className="kb-mobile-drawer-link" onClick={() => setMobileMenuOpen(false)}>
              <span>HPBSE Board Toppers</span>
              <ChevronRight size={16} />
            </a>
            <a href="#notices" className="kb-mobile-drawer-link" onClick={() => setMobileMenuOpen(false)}>
              <span>Circulars & Updates</span>
              <ChevronRight size={16} />
            </a>
            <a href="#gallery" className="kb-mobile-drawer-link" onClick={() => setMobileMenuOpen(false)}>
              <span>Campus Photo Gallery</span>
              <ChevronRight size={16} />
            </a>
            <a
              href="#admission"
              className="kb-mobile-drawer-link"
              style={{ background: 'var(--brand-orange)', color: '#fff', border: 'none' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Apply for Admission 2026–27</span>
              <Sparkles size={16} />
            </a>
          </div>
        )}
      </header>

      {/* 3. 78vh VISUAL HERO SLIDER (Pure Clean Images, No Cluttered Buttons/Overlays) */}
      <section className="kb-hero-carousel-wrap">
        <div
          className="kb-hero-track"
          style={{
            transform: `translateX(-${activeSlideIndex * 100}%)`
          }}
        >
          {heroSlides.map((slide, idx) => (
            <div key={slide.id || idx} className="kb-hero-slide-pane">
              <img src={slide.image} alt="Kid Buds Public Senior Secondary School Bijhari" className="kb-hero-bg-img" />
            </div>
          ))}
        </div>

        {/* Previous / Next Arrow Controls */}
        <button
          className="kb-hero-carousel-nav-btn prev"
          onClick={() => setActiveSlideIndex((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
          title="Previous Slide"
        >
          ❮
        </button>
        <button
          className="kb-hero-carousel-nav-btn next"
          onClick={() => setActiveSlideIndex((prev) => (prev + 1) % heroSlides.length)}
          title="Next Slide"
        >
          ❯
        </button>

        {/* Carousel Bottom Dots */}
        <div className="kb-hero-dots-row">
          {heroSlides.map((_, idx) => (
            <div
              key={idx}
              className={`kb-hero-dot ${activeSlideIndex === idx ? 'active' : ''}`}
              onClick={() => setActiveSlideIndex(idx)}
            />
          ))}
        </div>
      </section>

      {/* 4. ABOUT US: 3 CLEAN PILLARS + PRINCIPAL SPOTLIGHT (De-cluttered) */}
      <section id="about" className="kb-section kb-section-ivory">
        <div className="kb-container">
          <div className="kb-grid-2" style={{ alignItems: 'center', gap: '48px' }}>
            <div>
              <div className="kb-eyebrow">
                <GraduationCap size={15} /> Welcome to Kid Buds
              </div>
              <h2 className="kb-section-title">
                Excellence in Education at Bijhari, Hamirpur
              </h2>
              <p style={{ fontSize: '1.02rem', color: 'var(--text-body)', marginBottom: '24px', lineHeight: 1.6 }}>
                Affiliated to HPBSE Dharamshala, <strong>{settings.schoolName} {settings.subName}</strong> provides a continuous learning journey from joyful early childhood to Senior Secondary board excellence.
              </p>

              {/* 3 Visual Pillars (Consistent Navy Theme & Natural Wording) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)', boxShadow: '0 2px 8px rgba(13,39,87,0.03)' }}>
                  <div style={{ width: 42, height: 42, borderRadius: '10px', background: 'var(--royal-blue-light)', color: 'var(--royal-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', color: '#0e2b5c', fontWeight: 800, marginBottom: '3px' }}>
                      HPBSE Board Preparation & Strong Academics
                    </h4>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                      Comprehensive syllabus coverage with disciplined test series, personal attention, and competitive guidance for senior classes.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)', boxShadow: '0 2px 8px rgba(13,39,87,0.03)' }}>
                  <div style={{ width: 42, height: 42, borderRadius: '10px', background: 'var(--royal-blue-light)', color: 'var(--royal-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MonitorPlay size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', color: '#0e2b5c', fontWeight: 800, marginBottom: '3px' }}>
                      Smart Classrooms & Practical Science Labs
                    </h4>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                      Interactive audio-visual learning screens alongside well-equipped Physics, Chemistry, Biology and high-speed Computer labs.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)', boxShadow: '0 2px 8px rgba(13,39,87,0.03)' }}>
                  <div style={{ width: 42, height: 42, borderRadius: '10px', background: 'var(--royal-blue-light)', color: 'var(--royal-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', color: '#0e2b5c', fontWeight: 800, marginBottom: '3px' }}>
                      Safe Campus & School Bus Transport
                    </h4>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                      CCTV surveillance across all areas and reliable school transport connecting Bijhari, Barsar and neighboring villages.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Principal's Message Compact Spotlight */}
            <div
              className="kb-royal-card"
              style={{
                border: '1.5px solid var(--border-brand)',
                background: '#ffffff',
                boxShadow: 'var(--shadow-md)',
                padding: '30px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '18px' }}>
                <img
                  src={settings.principalPhoto}
                  alt={settings.principalName}
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: '16px',
                    objectFit: 'cover',
                    border: '2px solid var(--brand-orange)'
                  }}
                />
                <div>
                  <div style={{ fontSize: '0.74rem', fontWeight: 900, color: 'var(--brand-orange)', textTransform: 'uppercase' }}>
                    Principal's Desk
                  </div>
                  <h3 style={{ fontSize: '1.25rem', margin: '2px 0 2px', color: 'var(--royal-blue)' }}>
                    {settings.principalName}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {settings.principalQualification}
                  </div>
                </div>
              </div>

              <blockquote
                style={{
                  fontStyle: 'italic',
                  fontSize: '0.94rem',
                  lineHeight: 1.7,
                  color: 'var(--text-body)',
                  borderLeft: '3px solid var(--brand-orange)',
                  paddingLeft: '16px',
                  marginBottom: '16px'
                }}
              >
                "{settings.principalQuote}"
              </blockquote>

              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
                {settings.principalMessage}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. STREAMLINED CLASSES & STREAMS (Grounded & Clear: Nursery to 12th) */}
      <section id="classes" className="kb-section">
        <div className="kb-container">
          <div className="kb-section-header" style={{ marginBottom: '36px' }}>
            <div className="kb-eyebrow">
              <Layers size={14} /> Nursery to Class 12th
            </div>
            <h2 className="kb-section-title">Classes & Streams Offered</h2>
            <p className="kb-section-desc">
              Providing solid conceptual foundations from early childhood to Senior Secondary board exams.
            </p>
          </div>

          <div className="kb-grid-3">
            {/* 1. Foundational Wing */}
            <div className="kb-stream-card">
              <div style={{ display: 'inline-block', background: 'var(--brand-orange-light)', color: 'var(--brand-orange)', padding: '3px 10px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 900, marginBottom: '10px' }}>
                EARLY YEARS
              </div>
              <h3 style={{ fontSize: '1.25rem', color: '#0e2b5c', marginBottom: '8px' }}>
                Nursery, LKG & UKG
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.6 }}>
                Activity-based learning in safe and cheerful classrooms focusing on Hindi & English phonics, numbers, good manners, and joyful outdoor play.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem', color: 'var(--text-body)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="#16a34a" /> Child-friendly caring environment</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="#16a34a" /> Zero stress & joyful activities</li>
              </ul>
            </div>

            {/* 2. Primary & Middle */}
            <div className="kb-stream-card">
              <div style={{ display: 'inline-block', background: 'var(--royal-blue-light)', color: 'var(--royal-blue)', padding: '3px 10px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 900, marginBottom: '10px' }}>
                PRIMARY & MIDDLE
              </div>
              <h3 style={{ fontSize: '1.25rem', color: '#0e2b5c', marginBottom: '8px' }}>
                Class 1st to 10th (Matric)
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.6 }}>
                Strong fundamental basics in Mathematics, Science, English, Hindi and Computer basics aligned with the HPBSE Dharamshala board curriculum.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem', color: 'var(--text-body)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="#16a34a" /> Regular doubt-clearing sessions</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="#16a34a" /> 10th Board exam intensive test series</li>
              </ul>
            </div>

            {/* 3. Senior Secondary Streams */}
            <div className="kb-stream-card" style={{ borderColor: 'var(--brand-orange)' }}>
              <div style={{ display: 'inline-block', background: 'var(--brand-orange)', color: '#ffffff', padding: '3px 10px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 900, marginBottom: '10px' }}>
                SENIOR SECONDARY
              </div>
              <h3 style={{ fontSize: '1.25rem', color: '#0e2b5c', marginBottom: '8px' }}>
                Class 11th & 12th Streams
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.6 }}>
                Specialized Senior Secondary education with experienced teachers and laboratory practicals:
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem', color: 'var(--text-body)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="var(--brand-orange)" /> <strong>Science:</strong> Medical (PCB) & Non-Medical (PCM)</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="var(--brand-orange)" /> <strong>Commerce:</strong> Accounts, Economics, Business</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="var(--brand-orange)" /> <strong>Arts / Humanities:</strong> History, Pol. Science</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HPBSE BOARD TOPPERS: ROYAL WALL OF FAME (Digital Trophy Showcase) */}
      <section id="toppers" className="kb-section kb-section-pearl">
        <div className="kb-container">
          <div className="kb-section-header">
            <div className="kb-eyebrow">
              <Trophy size={14} /> HPBSE Board Merit & Honours
            </div>
            <h2 className="kb-section-title">Wall of Fame: Our HPBSE Board Toppers</h2>
            <p className="kb-section-desc">
              Consistently achieving 100% board results and top state merit ranks in Himachal Pradesh Board Examinations (HPBSE).
            </p>
          </div>

          <div className="kb-grid-3">
            {toppers.map((topper) => (
              <div
                key={topper.id}
                className="kb-royal-card"
                style={{
                  textAlign: 'center',
                  position: 'relative',
                  borderTop: '4px solid var(--brand-orange)',
                  padding: '28px 20px',
                  background: '#ffffff'
                }}
              >
                <div style={{ position: 'relative', width: 94, height: 94, margin: '0 auto 16px' }}>
                  <img
                    src={topper.image}
                    alt={topper.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #ffffff',
                      boxShadow: '0 4px 16px rgba(13, 39, 87, 0.18)'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: -2,
                      right: -2,
                      background: 'linear-gradient(135deg, #f25c05, #f59e0b)',
                      color: '#ffffff',
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.25)'
                    }}
                  >
                    <Award size={18} />
                  </div>
                </div>

                <div
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '2.2rem',
                    fontWeight: 900,
                    color: 'var(--royal-blue)',
                    marginBottom: '4px',
                    lineHeight: 1
                  }}
                >
                  {topper.percentage}
                </div>

                <h3 style={{ fontSize: '1.18rem', margin: '6px 0 2px', fontWeight: 800 }}>{topper.name}</h3>

                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--brand-orange)' }}>
                  {topper.classLevel} • {topper.stream}
                </div>

                <div
                  style={{
                    marginTop: '12px',
                    padding: '8px 12px',
                    background: 'var(--royal-blue-light)',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    color: 'var(--royal-blue)'
                  }}
                >
                  {topper.rank} ({topper.year})
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. COMPACT 2-COLUMN NOTICE BOARD & QUICK ADMISSION DESK */}
      <section id="notices" className="kb-section">
        <div className="kb-container">
          <div className="kb-section-header" style={{ marginBottom: '32px' }}>
            <div className="kb-eyebrow">
              <Calendar size={14} /> Official School Circulars
            </div>
            <h2 className="kb-section-title">Notice Board & Announcements</h2>
          </div>

          {/* Notice Board 2-Column Responsive Grid */}
          <div className="kb-notices-grid-wrap">
            {/* Left: Scrollable Clean Circulars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {notices.map((n) => (
                <div
                  key={n.id}
                  className="kb-royal-card"
                  style={{
                    padding: '18px 22px',
                    borderLeft: n.isImportant ? '4px solid var(--brand-orange)' : '4px solid var(--royal-blue)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '16px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '999px',
                          background: 'var(--royal-blue-light)',
                          color: 'var(--royal-blue)'
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
                            background: '#ffedd5',
                            color: '#c2410c'
                          }}
                        >
                          LATEST
                        </span>
                      )}
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{n.date}</span>
                    </div>
                    <h3 style={{ fontSize: '1.02rem', marginBottom: '4px', fontWeight: 800 }}>{n.title}</h3>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-body)', lineHeight: 1.5 }}>{n.summary}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Quick Action Admission Box */}
            <div
              className="kb-royal-card"
              style={{
                background: 'linear-gradient(180deg, #fff7ed 0%, #ffffff 100%)',
                border: '2px solid var(--brand-orange-border)',
                padding: '30px'
              }}
            >
              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  color: 'var(--brand-orange)',
                  letterSpacing: '0.06em'
                }}
              >
                Admissions Session 2026–27
              </span>
              <h3 style={{ fontSize: '1.35rem', margin: '6px 0 10px', color: 'var(--royal-blue)', fontWeight: 900 }}>
                Apply for Admission Online
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '20px' }}>
                Registrations are actively open for Nursery to Class 12th (Medical, Non-Medical, Commerce & Arts streams).
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a
                  href="#admission"
                  className="btn-royal-primary"
                  style={{
                    background: 'var(--brand-orange)',
                    padding: '12px',
                    width: '100%',
                    justifyContent: 'center',
                    border: 'none',
                    fontSize: '0.94rem'
                  }}
                >
                  <Sparkles size={16} /> Fill Online Enquiry Form
                </a>
                <a
                  href={`tel:${settings.phonePrimary}`}
                  className="btn-royal-outline"
                  style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: '0.9rem' }}
                >
                  <Phone size={15} /> Call Reception: {settings.phonePrimary}
                </a>
                <button
                  onClick={() => setIsDisclosureOpen(true)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '0.82rem',
                    color: 'var(--text-muted)',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    marginTop: '6px'
                  }}
                >
                  View HPBSE Mandatory Disclosure
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. WORLD-CLASS CAMPUS & FACILITIES GRID */}
      <section id="facilities" className="kb-section kb-section-ivory">
        <div className="kb-container">
          <div className="kb-section-header">
            <div className="kb-eyebrow">
              <BookOpen size={14} /> Infrastructure & Environment
            </div>
            <h2 className="kb-section-title">Designed for Modern Learning in Bijhari</h2>
            <p className="kb-section-desc">
              Safe, inspiring, and fully equipped facilities nurturing intellect, scientific curiosity, and physical well-being.
            </p>
          </div>

          <div className="kb-grid-3">
            {defaultFacilities.map((fac) => (
              <div key={fac.id} className="kb-royal-card" style={{ padding: '26px' }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '14px',
                    background: 'var(--bg-blue-tint)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                  }}
                >
                  {getFacilityIcon(fac.iconName)}
                </div>
                <h3 style={{ fontSize: '1.14rem', marginBottom: '4px' }}>{fac.title}</h3>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--royal-gold-dark)', marginBottom: '8px' }}>
                  {fac.subtitle}
                </div>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
                  {fac.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FACULTY & ACADEMIC LEADERSHIP DIRECTORY */}
      <section id="faculty" className="kb-section">
        <div className="kb-container">
          <div className="kb-section-header">
            <div className="kb-eyebrow">
              <Users size={14} /> Dedicated Mentors
            </div>
            <h2 className="kb-section-title">Meet Our Experienced Faculty</h2>
            <p className="kb-section-desc">
              Passionate educators, subject specialists, and compassionate guides committed to bringing out the finest in every student.
            </p>
          </div>

          <div className="kb-grid-3">
            {staff.map((member) => (
              <div key={member.id} className="kb-royal-card" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <img
                  src={member.image}
                  alt={member.name}
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: '16px',
                    objectFit: 'cover',
                    border: '1.5px solid var(--border-gold)',
                    flexShrink: 0
                  }}
                />
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--royal-gold-dark)' }}>
                    {member.department}
                  </span>
                  <h3 style={{ fontSize: '1.05rem', margin: '2px 0 3px' }}>{member.name}</h3>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--royal-blue)' }}>
                    {member.designation}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    {member.qualification} • {member.experience}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. CAMPUS LIFE PHOTO GALLERY */}
      <section id="gallery" className="kb-section kb-section-pearl">
        <div className="kb-container">
          <div className="kb-section-header">
            <div className="kb-eyebrow">
              <Camera size={14} /> Campus Moments
            </div>
            <h2 className="kb-section-title">Life & Energy at Kid Buds School</h2>
            <p className="kb-section-desc">
              Glimpses of joyful classroom discussions, sports meets, cultural fests, and scientific exploration.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="kb-filter-row">
            {galleryCategories.map((cat) => (
              <button
                key={cat}
                className={`kb-filter-pill ${galleryFilter === cat ? 'active' : ''}`}
                onClick={() => setGalleryFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="kb-grid-3">
            {filteredGallery.map((item) => (
              <div
                key={item.id}
                className="kb-hero-image-card"
                style={{ aspectRatio: '16 / 11', borderRadius: '16px' }}
              >
                <img src={item.image} alt={item.title} />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(15,23,42,0.85) 0%, transparent 100%)',
                    padding: '24px 16px 12px',
                    color: '#ffffff'
                  }}
                >
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#fde68a', textTransform: 'uppercase' }}>
                    {item.category}
                  </span>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{item.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. ADMISSIONS 2026–27 & CONTACT FUNNEL */}
      <section id="admission" className="kb-section">
        <div className="kb-container">
          <div className="kb-grid-2" style={{ gap: '48px', alignItems: 'flex-start' }}>
            {/* Left: Contact Info & Map */}
            <div id="contact">
              <div className="kb-eyebrow">
                <Sparkles size={14} /> Join Our Family
              </div>
              <h2 className="kb-section-title">Admissions Open for Session {settings.academicSession}</h2>
              <p style={{ fontSize: '0.98rem', color: 'var(--text-body)', marginBottom: '24px', lineHeight: 1.7 }}>
                We invite parents to visit our Bijhari campus, interact with our teaching faculty, and experience our joyful classrooms firsthand. Special merit scholarships are awarded to HPBOSE Class 10th board high achievers.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
                <div className="kb-royal-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <MapPin size={24} color="var(--royal-blue)" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Campus Address</div>
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>{settings.address}</div>
                  </div>
                </div>

                <div className="kb-royal-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <Phone size={24} color="var(--royal-blue)" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Helpline & WhatsApp</div>
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                      Primary: {settings.phonePrimary} • Office: {settings.phoneSecondary}
                    </div>
                  </div>
                </div>

                <div className="kb-royal-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <Clock size={24} color="var(--royal-blue)" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Office Visiting Hours</div>
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>{settings.officeTimings}</div>
                  </div>
                </div>
              </div>

              {/* Google Map Embed */}
              <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-light)', height: 200 }}>
                <iframe
                  title="School Location Map"
                  src={settings.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                />
              </div>
            </div>

            {/* Right: Online Admission Lead Capture Form */}
            <div
              className="kb-royal-card"
              style={{
                border: '1.5px solid var(--border-gold)',
                padding: '36px',
                background: '#ffffff',
                boxShadow: 'var(--shadow-lg)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    background: 'var(--royal-blue)',
                    color: '#fff',
                    padding: '2px 8px',
                    borderRadius: '999px'
                  }}
                >
                  Direct Inquiry
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--royal-gold-dark)' }}>
                  Session {settings.academicSession}
                </span>
              </div>
              <h3 style={{ fontSize: '1.45rem', marginBottom: '6px' }}>Online Admission Enquiry</h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Fill out the quick form below. Our admissions coordinator will get in touch with you.
              </p>

              {admissionSuccessMsg ? (
                <div
                  style={{
                    background: '#ecfdf5',
                    border: '1.5px solid #10b981',
                    borderRadius: '12px',
                    padding: '20px',
                    color: '#065f46',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <CheckCircle2 size={24} color="#10b981" />
                  {admissionSuccessMsg}
                </div>
              ) : (
                <form onSubmit={handleAdmissionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label className="kb-label">Student's Full Name *</label>
                    <input
                      className="kb-input"
                      placeholder="e.g. Aarav Sharma"
                      required
                      value={admissionForm.studentName}
                      onChange={(e) => setAdmissionForm({ ...admissionForm, studentName: e.target.value })}
                    />
                  </div>

                  <div className="kb-grid-2" style={{ gap: '12px' }}>
                    <div>
                      <label className="kb-label">Applying for Class *</label>
                      <select
                        className="kb-select"
                        value={admissionForm.applyingForClass}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, applyingForClass: e.target.value })}
                      >
                        <option value="Nursery (Early Years)">Nursery (Early Years)</option>
                        <option value="LKG / UKG">LKG / UKG</option>
                        <option value="Class 1st to 5th (Primary)">Class 1st to 5th (Primary)</option>
                        <option value="Class 6th to 8th (Middle)">Class 6th to 8th (Middle)</option>
                        <option value="Class 9th & 10th (Secondary)">Class 9th & 10th (Secondary)</option>
                        <option value="Class 11th (Science - Non-Medical)">Class 11th (Science - Non-Medical)</option>
                        <option value="Class 11th (Science - Medical)">Class 11th (Science - Medical)</option>
                        <option value="Class 11th (Commerce)">Class 11th (Commerce)</option>
                        <option value="Class 11th (Arts / Humanities)">Class 11th (Arts / Humanities)</option>
                      </select>
                    </div>

                    <div>
                      <label className="kb-label">Parent / Guardian Name</label>
                      <input
                        className="kb-input"
                        placeholder="e.g. Mr. Rajesh Sharma"
                        value={admissionForm.parentName}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, parentName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="kb-grid-2" style={{ gap: '12px' }}>
                    <div>
                      <label className="kb-label">Mobile Number *</label>
                      <input
                        className="kb-input"
                        type="tel"
                        placeholder="10-digit Phone No."
                        required
                        value={admissionForm.phone}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, phone: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="kb-label">Village / Town</label>
                      <input
                        className="kb-input"
                        placeholder="e.g. Bijhari / Barsar"
                        value={admissionForm.villageCity}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, villageCity: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="kb-label">Message / Previous School (Optional)</label>
                    <textarea
                      rows={3}
                      className="kb-textarea"
                      placeholder="Any specific query regarding transport, streams, or pre-board score..."
                      value={admissionForm.message}
                      onChange={(e) => setAdmissionForm({ ...admissionForm, message: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="btn-royal-primary" style={{ padding: '13px', width: '100%' }}>
                    <Send size={17} /> Submit Admission Enquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 12. CLEAN & FUNCTIONAL FOOTER (Streamlined 3-Column Layout, 100% Working Links) */}
      <footer className="kb-footer">
        <div className="kb-container">
          <div className="kb-footer-grid-wrap">
            {/* Col 1: Brand & Affiliation */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                <SchoolCrestLogo logoUrl={settings.logoUrl} schoolName={settings.schoolName} size={64} />
                <div className="kb-brand-block">
                  <div className="kb-logo-line-1" style={{ fontSize: '1.4rem' }}>KID BUDS</div>
                  <div className="kb-logo-line-2" style={{ fontSize: '0.78rem' }}>PUBLIC SR. SEC. SCHOOL</div>
                  <div className="kb-logo-line-3" style={{ fontSize: '0.66rem' }}>BIJHARI, HAMIRPUR • HPBSE</div>
                </div>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: 1.6 }}>
                A premier Senior Secondary institution dedicated to academic excellence, moral integrity, and bright futures for students of Hamirpur and surrounding areas.
              </p>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--royal-blue)' }}>
                Affiliation: <span style={{ color: 'var(--brand-orange)' }}>{settings.affiliationNo}</span>
              </div>
            </div>

            {/* Col 2: Useful Working Links */}
            <div>
              <h4 style={{ fontSize: '1.02rem', color: 'var(--royal-blue)', marginBottom: '16px', fontWeight: 800 }}>
                Quick Links
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
                <li><a href="#about" className="kb-ribbon-link">About Us & Principal</a></li>
                <li><a href="#classes" className="kb-ribbon-link">Classes & Streams (Nursery–12th)</a></li>
                <li><a href="#faculty" className="kb-ribbon-link">Faculty & Mentors</a></li>
                <li><a href="#toppers" className="kb-ribbon-link">HPBSE Board Toppers</a></li>
                <li><a href="#notices" className="kb-ribbon-link">Circulars & Announcements</a></li>
                <li><a href="#gallery" className="kb-ribbon-link">Campus Photo Gallery</a></li>
                <li>
                  <button
                    onClick={() => setIsDisclosureOpen(true)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 700, color: 'var(--royal-blue)' }}
                    className="kb-ribbon-link"
                  >
                    Mandatory Public Disclosure
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Contact Details & Staff Access */}
            <div>
              <h4 style={{ fontSize: '1.02rem', color: 'var(--royal-blue)', marginBottom: '16px', fontWeight: 800 }}>
                Campus Office
              </h4>
              <div style={{ fontSize: '0.86rem', color: 'var(--text-body)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>📍 {settings.address}</div>
                <div>📞 Phone: <a href={`tel:${settings.phonePrimary}`} style={{ fontWeight: 800, color: 'var(--royal-blue)' }}>{settings.phonePrimary}</a></div>
                <div>✉️ Email: <a href={`mailto:${settings.email}`} style={{ color: 'var(--text-muted)' }}>{settings.email}</a></div>
                <div>🕒 Hours: {settings.officeTimings}</div>
                <div style={{ marginTop: '10px' }}>
                  <button
                    onClick={() => setIsAdminOpen(true)}
                    className="btn-royal-outline"
                    style={{ padding: '7px 16px', fontSize: '0.82rem', borderColor: 'var(--border-light)' }}
                  >
                    <Lock size={13} /> Staff / Admin Login
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              paddingTop: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              fontSize: '0.82rem',
              color: 'var(--text-muted)'
            }}
          >
            <div>
              © {new Date().getFullYear()} {settings.schoolName} {settings.subName}, Bijhari (Hamirpur, H.P.). All rights reserved.
            </div>
            <div>
              Affiliated to Himachal Pradesh Board of School Education (HPBSE), Dharamshala
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Quick Action Button */}
      <a
        href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
          `Hello! I would like to enquire about admission at Kid Buds Public Senior Secondary School, Bijhari.`
        )}`}
        target="_blank"
        rel="noreferrer"
        className="kb-floating-whatsapp"
        title="Chat on WhatsApp"
      >
        <MessageSquare size={18} />
        <span>Admission WhatsApp</span>
      </a>

      {/* Admin Dashboard Modal */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        settings={settings}
        setSettings={setSettings}
        heroSlides={heroSlides}
        setHeroSlides={setHeroSlides}
        notices={notices}
        setNotices={setNotices}
        staff={staff}
        setStaff={setStaff}
        toppers={toppers}
        setToppers={setToppers}
        gallery={gallery}
        setGallery={setGallery}
        enquiries={enquiries}
        setEnquiries={setEnquiries}
        onResetDefaults={resetAllDefaults}
      />

      {/* Mandatory Public Disclosure Modal */}
      <MandatoryDisclosureModal
        isOpen={isDisclosureOpen}
        onClose={() => setIsDisclosureOpen(false)}
        settings={settings}
      />
    </div>
  );
}
