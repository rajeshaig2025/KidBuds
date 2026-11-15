// src/data/schoolData.js
// Initial Seed Data for Kid Buds Public Senior Secondary School, Bijhari, Distt. Hamirpur (H.P.)
// Affiliated to HP Board of School Education (HPBOSE), Dharamshala

export const defaultSchoolSettings = {
  schoolName: 'KID BUDS',
  shortName: 'KID BUDS',
  subName: 'PUBLIC SR. SEC. SCHOOL',
  locationShort: 'BIJHARI, HAMIRPUR, HIMACHAL PRADESH',
  tagline: 'Empowering Young Minds with Academic Excellence, Modern Labs & Values',
  boardAffiliation: 'Affiliated to H.P. Board of School Education (HPBSE), Dharamshala',
  affiliationNo: 'HPBSE / SR-SEC / HMR-2048',
  schoolCode: 'KBPS-176039',
  establishedYear: '2005',
  classesOffered: 'Nursery to Class 12th (Science, Commerce & Arts)',
  logoUrl: '/school_logo.jpg',
  phonePrimary: '+91 98162-45000',
  phoneSecondary: '01972-288240',
  whatsappNumber: '919816245000',
  email: 'info@kidbudsbijhari.edu.in',
  admissionsEmail: 'admissions@kidbudsbijhari.edu.in',
  address: 'Bijhari, Tehsil Barsar, District Hamirpur, Himachal Pradesh – 176039',
  officeTimings: 'Monday to Saturday: 8:30 AM – 3:30 PM',
  mapEmbedUrl: 'https://www.google.com/maps?q=Bijhari,Hamirpur,Himachal+Pradesh&output=embed',
  topAnnouncement: 'Admissions Open for Session 2026–27 (Nursery to Class 12th — Medical, Non-Medical, Commerce & Arts). Scholarships available for HPBSE Board Merit Holders!',
  admissionsOpen: true,
  academicSession: '2026–27',
  principalName: 'Dr. R. K. Verma',
  principalDesignation: 'Principal & Academic Director',
  principalQualification: 'M.Sc. (Physics), M.Ed., Ph.D. (Education) • 20+ Years Experience',
  principalPhoto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=85',
  principalQuote: 'At Kid Buds Public Senior Secondary School, Bijhari, we believe every child carries boundless potential. Our mission is to blend the rich cultural ethos of Himachal Pradesh with world-class smart classrooms, scientific inquiry, and compassionate mentorship.',
  principalMessage: 'Welcome to Kid Buds Public Senior Secondary School, Bijhari (Hamirpur). From our joyful Early Years wing (Nursery to UKG) to our rigorous Senior Secondary streams (Class 11th & 12th), we focus on conceptual clarity, moral integrity, competitive exam readiness (NEET, JEE, NDA, CUET), and holistic personality development. Together with our dedicated faculty and supportive parents, we prepare students not just for board examinations, but for life.',
  socialLinks: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com'
  },
  adminPin: 'kidbuds2026',
  stats: [
    { id: 's1', value: 'Nursery – 12th', label: 'Complete K-12 Continuum', sub: 'Foundational to Sr. Secondary' },
    { id: 's2', value: '100%', label: 'HPBSE Board Result', sub: 'Consistent State Merit Positions' },
    { id: 's3', value: '30+', label: 'Smart Classrooms & Labs', sub: 'Digital Boards & STEM Labs' },
    { id: 's4', value: '20:1', label: 'Student-Teacher Ratio', sub: 'Personalized Mentorship' }
  ]
};

export const defaultHeroSlides = [
  {
    id: 'hero-1',
    badge: 'HPBSE Dharamshala Affiliated • Nursery to 12th',
    title: 'Nurturing Future Leaders in the Serene Hills of Hamirpur',
    subtitle: 'State-of-the-art smart digital classrooms, advanced STEM laboratories & all-round personality development.',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=85',
    ctaPrimary: 'Apply for Admission 2026–27',
    ctaSecondary: 'Academic Wings'
  },
  {
    id: 'hero-2',
    badge: 'Senior Secondary Excellence • Medical, Non-Med, Commerce & Arts',
    title: 'Advanced Laboratories & Integrated Competitive Mentorship',
    subtitle: 'Hands-on practicals in Physics, Chemistry, Biology & High-Speed AI Computer Labs with senior PGT faculty.',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1920&q=85',
    ctaPrimary: 'Explore 11th & 12th Streams',
    ctaSecondary: 'View Faculty'
  },
  {
    id: 'hero-3',
    badge: 'Foundational Wing • Activity & Play-Way Learning',
    title: 'A Joyful & Caring Early Childhood Start (Nursery to UKG)',
    subtitle: 'Child-friendly spaces sparking early curiosity, English phonics, creativity and emotional confidence.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1920&q=85',
    ctaPrimary: 'Book a Campus Visit',
    ctaSecondary: 'Photo Gallery'
  },
  {
    id: 'hero-4',
    badge: 'Sports & Co-Curricular Excellence',
    title: 'Building Champions: Athletics, Yoga & Team Spirit',
    subtitle: 'Expansive sports grounds, annual athletic meets, and physical fitness guided by certified sports trainers.',
    image: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=1920&q=85',
    ctaPrimary: 'Explore Campus',
    ctaSecondary: 'Our Facilities'
  },
  {
    id: 'hero-5',
    badge: '100% Board Result Record',
    title: 'Celebrating Academic Merit in HPBSE Dharamshala Board Exams',
    subtitle: 'Consistently producing top district and state rank holders with dedicated individual doubt-clearing sessions.',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1920&q=85',
    ctaPrimary: 'View Board Toppers',
    ctaSecondary: 'Admission Process'
  }
];

export const defaultAcademicWings = [
  {
    id: 'wing-foundational',
    code: '01',
    title: 'Foundational Wing (Early Years)',
    grades: 'Nursery, LKG & UKG',
    ageGroup: 'Ages 3 to 6 Years',
    tagline: 'Play-Way, Montessori & Sensory Discovery',
    description: 'Inspired by international early-years pedagogy, our Foundational Wing nurtures curiosity through storytelling, phonics, art, music, smart interactive screens, and joyful outdoor play.',
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1000&q=80',
    highlights: [
      'Phonics & Bilingual Communication (English + Hindi)',
      'Montessori Math & Sensory Activity Corners',
      'Safe, Colorful & Airy Child-Friendly Classrooms',
      'Zero Homework Burden • Focus on Good Habits & Confidence'
    ],
    subjects: ['English Phonics', 'Number Magic', 'Environmental Awareness', 'Art & Craft', 'Rhymes & Rhythm', 'Physical Play']
  },
  {
    id: 'wing-primary-middle',
    code: '02',
    title: 'Primary & Middle Wing',
    grades: 'Class 1st to Class 8th',
    ageGroup: 'Ages 6 to 14 Years',
    tagline: 'Strong Conceptual Foundations & All-Round Growth',
    description: 'Building rock-solid fundamentals in Mathematics, Science, Languages, and Computer Coding while encouraging public speaking, Olympiad participation, and team sports.',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80',
    highlights: [
      'Smart Board Audio-Visual Interactive Lessons',
      'Hands-on Junior Science & Computer Coding Labs',
      'Weekly Spoken English, Debate & Quiz Competitions',
      'National Science & Maths Olympiad Preparation'
    ],
    subjects: ['English', 'Mathematics', 'Integrated Science', 'Social Studies', 'Hindi & Sanskrit', 'Computer & AI Basics', 'General Knowledge']
  },
  {
    id: 'wing-secondary',
    code: '03',
    title: 'Secondary Wing (High School)',
    grades: 'Class 9th & Class 10th',
    ageGroup: 'HPBSE Board Foundation',
    tagline: 'Academic Rigor, Lab Practicals & Career Readiness',
    description: 'Structured preparation for the HP Board of School Education (HPBSE) Class 10th examinations with regular mock tests, practical laboratory sessions, and personalized doubt-clearing.',
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=1000&q=80',
    highlights: [
      'HPBSE Dharamshala Aligned Curriculum & Test Series',
      'Dedicated Physics, Chemistry & Biology Practical Sessions',
      'NTSE & Foundation Coaching for Future Competitive Exams',
      'Individual Academic Counseling & Stream Selection Guidance'
    ],
    subjects: ['Mathematics', 'Science & Technology', 'English Literature & Grammar', 'Social Science', 'Hindi', 'Information Technology / Sanskrit']
  },
  {
    id: 'wing-senior-secondary',
    code: '04',
    title: 'Senior Secondary Wing',
    grades: 'Class 11th & Class 12th',
    ageGroup: 'Science (Med/Non-Med), Commerce & Arts',
    tagline: 'Specialized Streams & Competitive Exam Excellence',
    description: 'Our flagship Senior Secondary programme empowers students to excel in HPBSE Class 12th Board exams and crack national entrance tests like JEE, NEET, NDA, CA Foundation, and CUET.',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
    highlights: [
      'Science Stream: Medical (PCB) & Non-Medical (PCM) with Integrated NEET/JEE Modules',
      'Commerce Stream: Accountancy, Business Studies, Economics & Financial Literacy',
      'Humanities / Arts Stream: Political Science, History, Sociology, Geography & Economics',
      'Senior PGT Subject Specialists & Dedicated Library Study Hours'
    ],
    subjects: ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Accountancy', 'Business Studies', 'Economics', 'History & Political Science', 'Computer Science', 'Physical Education']
  }
];

export const defaultNotices = [
  {
    id: 'not-1',
    title: 'Admissions Open for Academic Session 2026–27 (Nursery to Class 12th)',
    category: 'Admission',
    date: '2026-03-10',
    isImportant: true,
    summary: 'Registration forms for Nursery to Class 9th and Class 11th (Science, Commerce & Arts) are now available at the school reception and online. Special merit scholarship for students scoring above 90% in Class 10th.',
    attachmentUrl: ''
  },
  {
    id: 'not-2',
    title: 'HPBSE Class 10th & 12th Pre-Board Examination Schedule Released',
    category: 'Examination',
    date: '2026-03-05',
    isImportant: true,
    summary: 'The second phase of Pre-Board Examinations for Class 10th and 12th will commence from Monday at 9:30 AM. Students must carry their school ID card and examination clipboard.',
    attachmentUrl: ''
  },
  {
    id: 'not-3',
    title: 'Parent-Teacher Meeting (PTM) & Annual Holistic Progress Card Showcase',
    category: 'Circular',
    date: '2026-02-28',
    isImportant: false,
    summary: 'All parents of Nursery to Class 9th & 11th are cordially invited to attend the Parent-Teacher Meeting this Saturday between 9:30 AM and 1:30 PM at the Bijhari campus.',
    attachmentUrl: ''
  },
  {
    id: 'not-4',
    title: 'District Level Science & Robotics Exhibition – 1st Prize Achievement',
    category: 'Achievement',
    date: '2026-02-18',
    isImportant: false,
    summary: 'Heartiest congratulations to our Class 11th Science students for winning 1st Position in the Hamirpur District Inter-School Science Innovation Model Competition!',
    attachmentUrl: ''
  },
  {
    id: 'not-5',
    title: 'Revised Summer School Timings & School Bus Route Timings (Bijhari–Barsar)',
    category: 'Circular',
    date: '2026-02-10',
    isImportant: false,
    summary: 'Effective from the 1st of next month, school reporting time for all classes will be 8:20 AM. Morning assembly begins promptly at 8:30 AM.',
    attachmentUrl: ''
  }
];

export const defaultToppers = [
  {
    id: 'top-1',
    name: 'Ananya Thakur',
    classLevel: 'Class 12th Board',
    stream: 'Science (Non-Medical)',
    percentage: '98.4%',
    rank: 'HPBSE State Merit Rank 4',
    year: '2025',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'top-2',
    name: 'Aarav Sharma',
    classLevel: 'Class 12th Board',
    stream: 'Science (Medical)',
    percentage: '97.8%',
    rank: 'District Topper • NEET Qualified',
    year: '2025',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'top-3',
    name: 'Kritika Ranaut',
    classLevel: 'Class 10th Board',
    stream: 'HPBSE Matriculation',
    percentage: '98.6%',
    rank: 'HPBSE State Merit Rank 3',
    year: '2025',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'top-4',
    name: 'Rohan Chandel',
    classLevel: 'Class 12th Board',
    stream: 'Commerce Stream',
    percentage: '96.6%',
    rank: '1st in Commerce Wing',
    year: '2025',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'top-5',
    name: 'Simran Kanwar',
    classLevel: 'Class 10th Board',
    stream: 'HPBSE Matriculation',
    percentage: '97.4%',
    rank: '100/100 in Mathematics & Science',
    year: '2025',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'top-6',
    name: 'Aditya Katoch',
    classLevel: 'Olympiad & Sports',
    stream: 'Class 11th (PCM)',
    percentage: 'Gold Medalist',
    rank: 'State Level Science Congress Winner',
    year: '2025',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80'
  }
];

export const defaultStaff = [
  {
    id: 'st-1',
    name: 'Dr. R. K. Verma',
    designation: 'Principal',
    department: 'Administration',
    qualification: 'M.Sc. (Physics), M.Ed., Ph.D.',
    subject: 'Academic Leadership & Senior Physics',
    experience: '20+ Years',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'st-2',
    name: 'Mrs. Sunita Pathania',
    designation: 'Vice Principal & HoD Science',
    department: 'Senior Secondary (PGT)',
    qualification: 'M.Sc. (Chemistry), B.Ed. (Gold Medalist)',
    subject: 'PGT Chemistry (Class 11th & 12th)',
    experience: '16 Years',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'st-3',
    name: 'Mr. Vikramjeet Singh Patial',
    designation: 'Senior Coordinator (Mathematics)',
    department: 'Senior Secondary (PGT)',
    qualification: 'M.Sc. (Mathematics), B.Ed., HP TET Qualified',
    subject: 'PGT Mathematics & JEE Foundation',
    experience: '14 Years',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'st-4',
    name: 'Ms. Neha Dogra',
    designation: 'Senior Biology Faculty',
    department: 'Senior Secondary (PGT)',
    qualification: 'M.Sc. (Botany), B.Ed.',
    subject: 'PGT Biology & NEET Foundation',
    experience: '11 Years',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'st-5',
    name: 'Mr. Sanjeev Kumar Sharma',
    designation: 'HoD Commerce & Humanities',
    department: 'Senior Secondary (PGT)',
    qualification: 'M.Com, M.A. (Economics), B.Ed.',
    subject: 'Accountancy & Economics',
    experience: '13 Years',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'st-6',
    name: 'Mrs. Pooja Chandel',
    designation: 'Foundational & Primary Wing Head',
    department: 'Primary & Pre-Primary (PRT)',
    qualification: 'M.A. (English), B.Ed., Diploma in Montessori Education',
    subject: 'Early Childhood Pedagogy & English Phonics',
    experience: '10 Years',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80'
  }
];

export const defaultGallery = [
  {
    id: 'gal-1',
    title: 'Kid Buds Main Academic Block & Lush Green Campus, Bijhari',
    category: 'Campus & Infrastructure',
    date: '2026',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'gal-2',
    title: 'Senior Secondary Chemistry & Physics Practical Laboratory',
    category: 'Science & Labs',
    date: '2026',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'gal-3',
    title: 'Interactive Digital Smart Classroom Session',
    category: 'Smart Classrooms',
    date: '2026',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'gal-4',
    title: 'Annual Cultural Fiesta & Prize Distribution Ceremony',
    category: 'Annual Function',
    date: '2025',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'gal-5',
    title: 'Foundational Wing Activity & Creative Art Workshop',
    category: 'Early Years (Nursery–UKG)',
    date: '2026',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'gal-6',
    title: 'Annual Athletics Meet & Inter-House Sports Championship',
    category: 'Sports & Athletics',
    date: '2025',
    image: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=1000&q=80'
  }
];

export const defaultFacilities = [
  {
    id: 'fac-1',
    title: 'Smart Interactive Classrooms',
    subtitle: 'Audio-Visual 4K Smart Panels',
    description: 'Spacious, well-ventilated classrooms equipped with interactive digital boards that bring complex Science, Math, and Geography concepts to life.',
    iconName: 'MonitorPlay'
  },
  {
    id: 'fac-2',
    title: 'Advanced STEM & Science Labs',
    subtitle: 'Physics, Chemistry, Biology & Robotics',
    description: 'Separate, fully-equipped Senior Secondary laboratories designed per HPBOSE standards for hands-on experimentation and scientific inquiry.',
    iconName: 'FlaskConical'
  },
  {
    id: 'fac-3',
    title: 'High-Tech Computer & AI Lab',
    subtitle: 'High-Speed Systems & Coding Curriculum',
    description: '1:1 student-to-computer ratio during practicals with modern software, Python/HTML coding modules, and supervised digital literacy.',
    iconName: 'Cpu'
  },
  {
    id: 'fac-4',
    title: 'Knowledge Resource Library',
    subtitle: '5,000+ Books, Journals & Reference Guides',
    description: 'A serene, bright reading sanctuary stocked with NCERT/HPBOSE textbooks, encyclopedias, competitive exam guides (NEET/JEE/NDA), and periodicals.',
    iconName: 'BookOpen'
  },
  {
    id: 'fac-5',
    title: 'Sports Arena & Co-Curriculars',
    subtitle: 'Athletics, Basketball, Volleyball & Yoga',
    description: 'Dedicated sports fields, indoor games, House competitions, NCC/Scout spirit, and daily fitness routines guided by certified physical education coaches.',
    iconName: 'Trophy'
  },
  {
    id: 'fac-6',
    title: 'Safe GPS Fleet & CCTV Campus',
    subtitle: '24×7 Security & Medical Infirmary',
    description: 'Complete CCTV surveillance across corridors, purified RO drinking water, first-aid medical room, and safe school buses connecting Bijhari, Barsar & nearby villages.',
    iconName: 'ShieldCheck'
  }
];

export const defaultEnquiries = [
  {
    id: 'enq-demo-1',
    studentName: 'Vihaan Thakur',
    applyingForClass: 'Class 11th (Science - Non-Medical)',
    parentName: 'Mr. Kuldeep Thakur',
    phone: '9816012345',
    villageCity: 'Bijhari, Hamirpur',
    message: 'Scored 94% in Class 10th Pre-boards. Looking for admission in Non-Medical stream with JEE coaching support.',
    status: 'New',
    createdAt: '2026-03-12T10:30:00.000Z'
  },
  {
    id: 'enq-demo-2',
    studentName: 'Aadhya Sharma',
    applyingForClass: 'Nursery (Foundational Wing)',
    parentName: 'Mrs. Ritu Sharma',
    phone: '9418054321',
    villageCity: 'Barsar, Hamirpur',
    message: 'Want to enquire about Nursery admission process and school bus facility from Barsar.',
    status: 'Contacted',
    createdAt: '2026-03-10T14:15:00.000Z'
  }
];

export const mandatoryDisclosureData = {
  generalInfo: [
    { label: 'Name of the School', value: 'KID BUDS PUBLIC SENIOR SECONDARY SCHOOL' },
    { label: 'Affiliated Board', value: 'Himachal Pradesh Board of School Education (HPBOSE), Dharamshala' },
    { label: 'School Level & Streams', value: 'Senior Secondary (Nursery to Class 12th — Science, Commerce & Arts)' },
    { label: 'Complete Address', value: 'Bijhari, Tehsil Barsar, District Hamirpur, Himachal Pradesh – 176039' },
    { label: 'Medium of Instruction', value: 'English & Hindi' },
    { label: 'Academic Session Period', value: 'April to March' }
  ],
  infrastructure: [
    { label: 'Total Classrooms (Smart Enabled)', value: '30 Spacious Well-Ventilated Rooms' },
    { label: 'Science Laboratories (Physics, Chemistry, Biology)', value: '3 Dedicated Senior Secondary Labs' },
    { label: 'Computer & Digital Learning Lab', value: '2 Labs with High-Speed Broadband' },
    { label: 'Library Facility', value: '5,200+ Books, Magazines & Competitive Exam Section' },
    { label: 'Separate Hygienic Washrooms for Girls & Boys', value: 'Yes (On Every Floor) + RO Drinking Water' },
    { label: 'Campus Safety & Fire Norms', value: 'CCTV Monitored Campus + Fire Safety Certified' }
  ]
};
