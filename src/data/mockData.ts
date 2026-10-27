import { Company, StudentProfile, Application, PlacementStats, User } from '../types';

export const DEMO_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Sasidharan R',
    email: 'sasi.student@university.edu',
    role: 'student',
    createdAt: '2026-01-10',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-2',
    name: 'Placement Officer',
    email: 'admin.placement@university.edu',
    role: 'admin',
    createdAt: '2025-08-01',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-3',
    name: 'Tech Recruiter',
    email: 'recruiter.zoho@zoho.com',
    role: 'recruiter',
    createdAt: '2026-02-01',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  }
];

export const DEMO_STUDENT_PROFILE: StudentProfile = {
  id: 'profile-1',
  userId: 'user-1',
  name: 'Sasidharan R',
  email: 'sasi.student@university.edu',
  phone: '+91 98765 43210',
  location: 'Chennai, India',
  college: 'National Institute of Technology',
  degree: 'Bachelor of Technology (B.Tech)',
  department: 'Computer Science and Engineering',
  cgpa: 8.4,
  graduationYear: 2026,
  skills: [
    { name: 'Java', level: 'Advanced', category: 'Language' },
    { name: 'React', level: 'Advanced', category: 'Framework' },
    { name: 'SQL', level: 'Intermediate', category: 'Database' },
    { name: 'JavaScript', level: 'Advanced', category: 'Language' },
    { name: 'TypeScript', level: 'Intermediate', category: 'Language' },
    { name: 'Node.js', level: 'Intermediate', category: 'Framework' },
    { name: 'MongoDB', level: 'Intermediate', category: 'Database' },
    { name: 'Git', level: 'Advanced', category: 'Tool' },
    { name: 'Data Structures & Algorithms', level: 'Advanced', category: 'Core CS' },
    { name: 'HTML/CSS', level: 'Expert', category: 'Language' },
  ],
  programmingLanguages: ['Java', 'JavaScript', 'TypeScript', 'Python', 'C++'],
  certifications: [
    {
      id: 'cert-1',
      name: 'Oracle Certified Associate: Java SE 11',
      issuer: 'Oracle',
      year: '2025',
      credentialUrl: 'https://oracle.com/cert/12345'
    },
    {
      id: 'cert-2',
      name: 'Meta Front-End Developer Professional Certificate',
      issuer: 'Coursera / Meta',
      year: '2025',
      credentialUrl: 'https://coursera.org/verify/meta987'
    }
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'E-Commerce Microservices Platform',
      description: 'Architected scalable online storefront with product catalog, cart microservice, and secure stripe payment processing.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'JWT', 'Tailwind CSS'],
      githubUrl: 'https://github.com/sasidharan/ecommerce-platform',
      liveUrl: 'https://ecommerce-platform-demo.vercel.app'
    },
    {
      id: 'proj-2',
      name: 'Campus Placement Management Portal',
      description: 'Engineered role-based placement tracker for 600+ students with automated eligibility validation and company shortlisting.',
      technologies: ['Java', 'Spring Boot', 'MySQL', 'React', 'REST API'],
      githubUrl: 'https://github.com/sasidharan/placement-portal'
    },
    {
      id: 'proj-3',
      name: 'Real-time Collaborative Code Editor',
      description: 'Implemented WebSocket synchronized coding workspace supporting syntax highlighting, chat, and multi-user cursor tracking.',
      technologies: ['React', 'WebSockets', 'Node.js', 'Monaco Editor'],
      githubUrl: 'https://github.com/sasidharan/code-collab'
    }
  ],
  careerPreferences: {
    preferredRoles: ['Software Engineer', 'Full Stack Developer', 'Frontend Engineer', 'Backend Developer'],
    preferredLocations: ['Chennai', 'Bengaluru', 'Hyderabad', 'Remote'],
    experienceLevel: 'Fresher / Entry-level',
    careerInterests: ['Product Development', 'Cloud Systems', 'Distributed Computing', 'FinTech'],
    minSalaryLPA: 6
  },
  softSkills: {
    aptitudeScore: 88,
    communicationScore: 84
  },
  resumeFileName: 'Sasidharan_Resume_2026.pdf',
  resumeScore: 82,
  resumeLastAnalyzed: '2026-08-25',
  profileStrength: 86
};

export const ALTERNATIVE_PROFILES: { label: string; profile: StudentProfile }[] = [
  {
    label: 'Sasidharan (Full-Stack / Java) [Default]',
    profile: DEMO_STUDENT_PROFILE
  },
  {
    label: 'Priya Sharma (Data Science & ML)',
    profile: {
      ...DEMO_STUDENT_PROFILE,
      id: 'profile-2',
      name: 'Priya Sharma',
      email: 'priya.ds@university.edu',
      cgpa: 9.1,
      skills: [
        { name: 'Python', level: 'Expert', category: 'Language' },
        { name: 'Machine Learning', level: 'Advanced', category: 'Core CS' },
        { name: 'SQL', level: 'Advanced', category: 'Database' },
        { name: 'TensorFlow', level: 'Intermediate', category: 'Framework' },
        { name: 'Pandas', level: 'Expert', category: 'Tool' },
        { name: 'Scikit-Learn', level: 'Advanced', category: 'Framework' },
        { name: 'Power BI', level: 'Intermediate', category: 'Tool' },
        { name: 'Deep Learning', level: 'Intermediate', category: 'Core CS' }
      ],
      programmingLanguages: ['Python', 'R', 'SQL', 'C++'],
      careerPreferences: {
        preferredRoles: ['Data Scientist', 'Machine Learning Engineer', 'Data Analyst', 'AI Specialist'],
        preferredLocations: ['Bengaluru', 'Hyderabad', 'Pune'],
        experienceLevel: 'Fresher / Entry-level',
        careerInterests: ['AI/ML', 'Healthcare Analytics', 'Predictive Modeling'],
        minSalaryLPA: 8
      },
      profileStrength: 92,
      resumeScore: 89
    }
  },
  {
    label: 'Arun Kumar (Cloud & DevOps / Golang)',
    profile: {
      ...DEMO_STUDENT_PROFILE,
      id: 'profile-3',
      name: 'Arun Kumar',
      email: 'arun.devops@university.edu',
      cgpa: 7.8,
      skills: [
        { name: 'Docker', level: 'Advanced', category: 'Tool' },
        { name: 'Kubernetes', level: 'Intermediate', category: 'Cloud' },
        { name: 'AWS', level: 'Advanced', category: 'Cloud' },
        { name: 'Linux', level: 'Advanced', category: 'Core CS' },
        { name: 'Python', level: 'Intermediate', category: 'Language' },
        { name: 'Go', level: 'Intermediate', category: 'Language' },
        { name: 'CI/CD', level: 'Advanced', category: 'Tool' },
        { name: 'Terraform', level: 'Intermediate', category: 'Tool' }
      ],
      programmingLanguages: ['Go', 'Python', 'Bash', 'YAML'],
      careerPreferences: {
        preferredRoles: ['DevOps Engineer', 'Cloud Engineer', 'Site Reliability Engineer', 'Backend Developer'],
        preferredLocations: ['Bengaluru', 'Chennai', 'Remote'],
        experienceLevel: 'Fresher / Entry-level',
        careerInterests: ['Cloud Infrastructure', 'Automation', 'Containerization'],
        minSalaryLPA: 7
      },
      profileStrength: 80,
      resumeScore: 79
    }
  }
];

export const MOCK_COMPANIES: Company[] = [
  {
    id: 'comp-1',
    name: 'Zoho Corporation',
    logo: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=100&auto=format&fit=crop&q=80',
    industry: 'Software / SaaS',
    description: 'Zoho Corporation is a leading Indian multinational technology company specializing in cloud-based business management software and web tools.',
    website: 'https://www.zoho.com',
    headquarters: 'Chennai, Tamil Nadu',
    locations: ['Chennai', 'Tenkasi', 'Coimbatore', 'Bengaluru'],
    salaryDisplay: '₹6–10 LPA',
    minLPA: 6,
    maxLPA: 10,
    requiredSkills: ['Java', 'React', 'SQL', 'Data Structures & Algorithms', 'Object Oriented Programming'],
    preferredSkills: ['Spring Boot', 'REST API', 'JavaScript', 'Docker'],
    minimumCgpa: 7.0,
    companySize: '15,000+ Employees',
    hiringStatus: 'Currently Hiring',
    tier: 'Tier-2',
    rating: 4.5,
    applicationDeadline: '2026-09-30',
    techStack: ['Java', 'React', 'PostgreSQL', 'Redis', 'Linux', 'Microservices'],
    benefits: ['Subsidized Healthy Meals', 'Transit & Shuttle Services', 'Medical Insurance', 'Skill Development Allowance', 'Campus Sports Facilities'],
    hiringProcess: [
      { step: 1, title: 'Round 1: Online Aptitude & Basic Code', description: '60-minute test evaluating numerical ability, logical deduction, and fundamental programming output questions.' },
      { step: 2, title: 'Round 2: Advanced Coding & Problem Solving', description: 'Implementation of complex data structure patterns, matrix manipulations, and algorithm optimization.' },
      { step: 3, title: 'Round 3: Application Development Round', description: 'Design and code a complete console or mini application (e.g. Railway Reservation, Taxi Booking) in 2.5 hours.' },
      { step: 4, title: 'Round 4: Technical & System Discussion', description: 'In-depth review of OOP concepts, database schema design, and project architecture.' },
      { step: 5, title: 'Round 5: HR Interview', description: 'Cultural alignment, communication, career goals, and offer rollout.' }
    ],
    openRoles: [
      {
        id: 'role-zoho-1',
        title: 'Software Engineer',
        department: 'Product Engineering',
        location: 'Chennai',
        type: 'Full-time',
        salary: '₹6–10 LPA',
        minLPA: 6,
        maxLPA: 10,
        openings: 45,
        requirements: ['Strong command over Java or C++', 'Solid grasp of Data Structures and Algorithms', 'Experience with Relational Databases (SQL)']
      },
      {
        id: 'role-zoho-2',
        title: 'Member Technical Staff - UI/UX',
        department: 'Design & Web',
        location: 'Chennai',
        type: 'Full-time',
        salary: '₹6.5–9.5 LPA',
        minLPA: 6.5,
        maxLPA: 9.5,
        openings: 20,
        requirements: ['Proficiency with React, TypeScript, and modern CSS', 'Experience building modular frontend components']
      }
    ]
  },
  {
    id: 'comp-2',
    name: 'Microsoft',
    logo: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=100&auto=format&fit=crop&q=80',
    industry: 'Cloud & Enterprise Computing',
    description: 'Microsoft Corporation is an American multinational corporation and technology company producing computer software, consumer electronics, and personal computers.',
    website: 'https://microsoft.com/careers',
    headquarters: 'Redmond, WA (India HQ: Hyderabad)',
    locations: ['Bengaluru', 'Hyderabad', 'Noida'],
    salaryDisplay: '₹18–28 LPA',
    minLPA: 18,
    maxLPA: 28,
    requiredSkills: ['Data Structures & Algorithms', 'C++', 'Java', 'System Design', 'Operating Systems', 'Computer Networks'],
    preferredSkills: ['Azure', 'Distributed Systems', 'C#', 'Docker', 'Kubernetes'],
    minimumCgpa: 8.0,
    companySize: '220,000+ Employees',
    hiringStatus: 'Currently Hiring',
    tier: 'Dream / Tier-1',
    rating: 4.8,
    applicationDeadline: '2026-09-15',
    techStack: ['C++', 'C#', 'Azure', 'TypeScript', 'React', 'Kubernetes'],
    benefits: ['Comprehensive Health Coverage', 'Stock Grants (RSUs)', 'Work From Anywhere Flexibility', 'Generous Wellness Reimbursement', 'Parental Leave'],
    hiringProcess: [
      { step: 1, title: 'Online Assessment (Codility)', description: '3 algorithmic challenges testing DP, Graphs, and Tree structures.' },
      { step: 2, title: 'Technical Interview 1', description: 'Problem-solving on data structures, complexity analysis, and edge case reasoning.' },
      { step: 3, title: 'Technical Interview 2', description: 'System design, concurrency, memory management, and project deep-dive.' },
      { step: 4, title: 'AA (As Appropriate) Director Round', description: 'Behavioral evaluation, leadership principles, and architectural problem solving.' }
    ],
    openRoles: [
      {
        id: 'role-ms-1',
        title: 'Software Engineer (SWE I)',
        department: 'Azure Core / Office 365',
        location: 'Bengaluru',
        type: 'Full-time',
        salary: '₹18–26 LPA',
        minLPA: 18,
        maxLPA: 26,
        openings: 30,
        requirements: ['B.Tech in CSE / IT with CGPA >= 8.0', 'Exceptional problem-solving abilities', 'Solid foundations in CS fundamentals']
      }
    ]
  },
  {
    id: 'comp-3',
    name: 'Freshworks',
    logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&auto=format&fit=crop&q=80',
    industry: 'Customer Engagement SaaS',
    description: 'Freshworks creates innovative customer engagement software for businesses of all sizes, making it easy for teams to acquire, close, and keep their customers for life.',
    website: 'https://freshworks.com',
    headquarters: 'San Mateo, CA (India HQ: Chennai)',
    locations: ['Chennai', 'Bengaluru', 'Hyderabad'],
    salaryDisplay: '₹9–15 LPA',
    minLPA: 9,
    maxLPA: 15,
    requiredSkills: ['JavaScript', 'React', 'Node.js', 'SQL', 'REST API', 'Data Structures & Algorithms'],
    preferredSkills: ['Ruby on Rails', 'AWS', 'Redis', 'TypeScript'],
    minimumCgpa: 7.2,
    companySize: '6,000+ Employees',
    hiringStatus: 'Currently Hiring',
    tier: 'Tier-2',
    rating: 4.4,
    applicationDeadline: '2026-10-05',
    techStack: ['React', 'Node.js', 'Ruby on Rails', 'AWS', 'MySQL', 'Kafka'],
    benefits: ['Flexible Working Hours', 'Learning Stipend', 'Health Insurance', 'Modern Office Recreation'],
    hiringProcess: [
      { step: 1, title: 'Online Coding Challenge', description: 'HackerEarth assessment focusing on fullstack concepts and algorithmic problem solving.' },
      { step: 2, title: 'Technical Round 1', description: 'Frontend state management, JS event loop, component optimization, and async operations.' },
      { step: 3, title: 'Technical Round 2', description: 'Backend API design, database normalization, and system scalability.' },
      { step: 4, title: 'Culture Fit & HR', description: 'Values discussion and compensation.' }
    ],
    openRoles: [
      {
        id: 'role-fw-1',
        title: 'Full Stack Developer',
        department: 'Product Development',
        location: 'Chennai',
        type: 'Full-time',
        salary: '₹10–14 LPA',
        minLPA: 10,
        maxLPA: 14,
        openings: 25,
        requirements: ['Strong expertise in React & Node.js', 'Experience with relational or NoSQL databases', 'Solid Git workflow']
      }
    ]
  },
  {
    id: 'comp-4',
    name: 'TCS (Tata Consultancy Services)',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop&q=80',
    industry: 'IT Services & Consulting',
    description: 'TCS is a global leader in IT services, consulting, and business solutions with a vast network of innovation and delivery centers.',
    website: 'https://www.tcs.com',
    headquarters: 'Mumbai, Maharashtra',
    locations: ['Chennai', 'Bengaluru', 'Hyderabad', 'Pune', 'Mumbai', 'Kolkata', 'Delhi NCR'],
    salaryDisplay: '₹3.6–9.0 LPA (Ninja / Digital / Prime)',
    minLPA: 3.6,
    maxLPA: 9.0,
    requiredSkills: ['Java', 'SQL', 'C++', 'Python', 'Object Oriented Programming', 'Communication Skills'],
    preferredSkills: ['Spring Boot', 'React', 'Cloud Basics', 'Machine Learning'],
    minimumCgpa: 6.5,
    companySize: '600,000+ Employees',
    hiringStatus: 'Currently Hiring',
    tier: 'Core IT / Mass',
    rating: 4.1,
    applicationDeadline: '2026-10-15',
    techStack: ['Java', 'Spring', 'Oracle DB', 'Angular', 'AWS', 'Azure'],
    benefits: ['TCS Elevate & Wings Fast-track Growth', 'Health Insurance', 'Provident Fund & Gratuity', 'Higher Education Sponsorship'],
    hiringProcess: [
      { step: 1, title: 'TCS NQT (National Qualifier Test)', description: 'Cognitive skills, verbal reasoning, quantitative aptitude, and programming logic.' },
      { step: 2, title: 'Technical Interview', description: 'Evaluation based on tier cadre (Ninja / Digital / Prime) covering core subjects and coding.' },
      { step: 3, title: 'MR & HR Interview', description: 'Managerial scenarios, willingness to relocate, and personal verification.' }
    ],
    openRoles: [
      {
        id: 'role-tcs-1',
        title: 'TCS Digital / Prime Engineer',
        department: 'Digital Enterprise Solutions',
        location: 'Chennai',
        type: 'Full-time',
        salary: '₹7.2–9.0 LPA',
        minLPA: 7.2,
        maxLPA: 9.0,
        openings: 120,
        requirements: ['High NQT score in advanced coding', 'Knowledge of modern web frameworks or Cloud/AI']
      }
    ]
  },
  {
    id: 'comp-5',
    name: 'Amazon',
    logo: 'https://images.unsplash.com/photo-1523474253243-7851a31c3f4d?w=100&auto=format&fit=crop&q=80',
    industry: 'E-Commerce & Cloud Computing',
    description: 'Amazon is guided by four principles: customer obsession rather than competitor focus, passion for invention, commitment to operational excellence, and long-term thinking.',
    website: 'https://amazon.jobs',
    headquarters: 'Seattle, WA (India HQ: Bengaluru)',
    locations: ['Bengaluru', 'Hyderabad', 'Chennai'],
    salaryDisplay: '₹22–32 LPA',
    minLPA: 22,
    maxLPA: 32,
    requiredSkills: ['Java', 'Data Structures & Algorithms', 'System Design', 'Object Oriented Programming', 'Operating Systems'],
    preferredSkills: ['AWS', 'Distributed Systems', 'DynamoDB', 'Microservices'],
    minimumCgpa: 7.5,
    companySize: '1,500,000+ Employees',
    hiringStatus: 'Currently Hiring',
    tier: 'Dream / Tier-1',
    rating: 4.6,
    applicationDeadline: '2026-09-25',
    techStack: ['Java', 'C++', 'AWS', 'DynamoDB', 'React', 'Lambda'],
    benefits: ['Base + Huge RSU Stocks', 'Premium Medical Insurance', 'Relocation Allowance', 'Employee Discounts'],
    hiringProcess: [
      { step: 1, title: 'Online Assessment 1 (Debugging & Logic)', description: '7 debugging questions + 2 coding questions.' },
      { step: 2, title: 'Online Assessment 2 (Work Style Assessment)', description: 'Situational judgment test based on Amazon Leadership Principles.' },
      { step: 3, title: 'Technical Rounds (3-4 Rounds)', description: 'Hard DSA problems + Amazon 16 Leadership Principles storytelling.' },
      { step: 4, title: 'Bar Raiser Round', description: 'Rigorous cross-team interviewer assessing cultural bar and high potential.' }
    ],
    openRoles: [
      {
        id: 'role-amz-1',
        title: 'Software Development Engineer I (SDE-1)',
        department: 'AWS / Retail Platform',
        location: 'Bengaluru',
        type: 'Full-time',
        salary: '₹24–32 LPA',
        minLPA: 24,
        maxLPA: 32,
        openings: 35,
        requirements: ['Strong knowledge of Java / C++', 'Proven grasp of tree, graph, and DP problems', 'Customer-obsessed mindset']
      }
    ]
  },
  {
    id: 'comp-6',
    name: 'Accolite Digital',
    logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=100&auto=format&fit=crop&q=80',
    industry: 'Digital Transformation & Product Engineering',
    description: 'Accolite Digital is a premier digital transformation services company that solves complex digital challenges through human-centered engineering.',
    website: 'https://www.accolite.com',
    headquarters: 'Addison, TX (India HQ: Bengaluru)',
    locations: ['Bengaluru', 'Hyderabad', 'Chennai', 'Pune'],
    salaryDisplay: '₹8–11 LPA',
    minLPA: 8,
    maxLPA: 11,
    requiredSkills: ['Java', 'Data Structures & Algorithms', 'SQL', 'Spring Boot', 'Object Oriented Programming'],
    preferredSkills: ['React', 'Microservices', 'Git', 'Docker'],
    minimumCgpa: 7.0,
    companySize: '3,500+ Employees',
    hiringStatus: 'Currently Hiring',
    tier: 'Tier-2',
    rating: 4.3,
    applicationDeadline: '2026-10-10',
    techStack: ['Java', 'Spring Boot', 'React', 'Oracle', 'Kafka'],
    benefits: ['Competitive Compensation', 'Certification Sponsorship', 'Health Insurance', 'Annual Wellness Program'],
    hiringProcess: [
      { step: 1, title: 'Eduthrill MCQs + Coding', description: 'CS fundamentals and DSA coding.' },
      { step: 2, title: 'Technical Interview 1', description: 'Java internal workings, multithreading, and live coding.' },
      { step: 3, title: 'Technical Interview 2', description: 'Data modeling, REST architecture, and project walkthrough.' },
      { step: 4, title: 'HR & Management Round', description: 'Communication, relocation, and offer discussion.' }
    ],
    openRoles: [
      {
        id: 'role-acc-1',
        title: 'Software Engineer',
        department: 'Banking & Financial Services Engineering',
        location: 'Chennai',
        type: 'Full-time',
        salary: '₹8–11 LPA',
        minLPA: 8,
        maxLPA: 11,
        openings: 40,
        requirements: ['B.Tech / MCA in CS / IT', 'Strong Java and SQL background']
      }
    ]
  },
  {
    id: 'comp-7',
    name: 'Google',
    logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&auto=format&fit=crop&q=80',
    industry: 'Internet & Artificial Intelligence',
    description: 'Google’s mission is to organize the world’s information and make it universally accessible and useful.',
    website: 'https://careers.google.com',
    headquarters: 'Mountain View, CA (India HQ: Bengaluru & Hyderabad)',
    locations: ['Bengaluru', 'Hyderabad'],
    salaryDisplay: '₹26–38 LPA',
    minLPA: 26,
    maxLPA: 38,
    requiredSkills: ['Data Structures & Algorithms', 'C++', 'Java', 'Python', 'System Design', 'Mathematics'],
    preferredSkills: ['Distributed Computing', 'Machine Learning', 'TensorFlow', 'Linux Kernel'],
    minimumCgpa: 8.5,
    companySize: '180,000+ Employees',
    hiringStatus: 'Hiring Soon',
    tier: 'Dream / Tier-1',
    rating: 4.9,
    applicationDeadline: '2026-11-01',
    techStack: ['C++', 'Go', 'Python', 'Java', 'Spanner', 'Borg', 'Kubernetes'],
    benefits: ['Gourmet Meals', 'Top-tier Equity/RSUs', 'Comprehensive Global Health Care', 'On-site Fitness & Wellness', 'Education Allowance'],
    hiringProcess: [
      { step: 1, title: 'Online Assessment (Google Online Challenge)', description: '2 highly complex algorithmic challenges in 60 minutes.' },
      { step: 2, title: 'Phone Screening / Pre-screen', description: '45-minute live coding session on Google Docs.' },
      { step: 3, title: 'Onsite / Virtual Coding Rounds (3 Rounds)', description: 'Advanced graph algorithms, dynamic programming, segment trees, and efficiency.' },
      { step: 4, title: 'Googleyness & Leadership', description: 'Behavioral assessment on collaborative mindset and problem navigation.' }
    ],
    openRoles: [
      {
        id: 'role-goog-1',
        title: 'Software Engineer, Early Career',
        department: 'Search / Maps / Ads Core',
        location: 'Bengaluru',
        type: 'Full-time',
        salary: '₹28–36 LPA',
        minLPA: 28,
        maxLPA: 36,
        openings: 15,
        requirements: ['CGPA >= 8.5 in Computer Science', 'Superb algorithmic and mathematical competence']
      }
    ]
  },
  {
    id: 'comp-8',
    name: 'Infosys',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop&q=80',
    industry: 'IT Consulting & Services',
    description: 'Infosys is a global leader in next-generation digital services and consulting, enabling clients in more than 50 countries to navigate their digital transformation.',
    website: 'https://www.infosys.com/careers',
    headquarters: 'Bengaluru, Karnataka',
    locations: ['Bengaluru', 'Chennai', 'Hyderabad', 'Pune', 'Mysuru', 'Chandigarh'],
    salaryDisplay: '₹3.6–9.5 LPA (SE / DSE / Specialist Programmer)',
    minLPA: 3.6,
    maxLPA: 9.5,
    requiredSkills: ['Java', 'Python', 'SQL', 'C++', 'Data Structures', 'Communication'],
    preferredSkills: ['Spring Boot', 'React', 'Cloud Services', 'DevOps Basics'],
    minimumCgpa: 6.5,
    companySize: '320,000+ Employees',
    hiringStatus: 'Currently Hiring',
    tier: 'Core IT / Mass',
    rating: 4.0,
    applicationDeadline: '2026-10-20',
    techStack: ['Java', 'Spring', 'Angular', 'Python', 'AWS', 'Oracle'],
    benefits: ['Mysore World-class Training Campus', 'Higher Education with Coursera/InfyTQ', 'Health & Accident Insurance'],
    hiringProcess: [
      { step: 1, title: 'HackWithInfy / InfyTQ / Online Test', description: 'Aptitude test or coding contest qualifying students for Specialist Programmer or DSE roles.' },
      { step: 2, title: 'Technical Interview', description: 'OOP concepts, project explanations, and basic SQL query construction.' },
      { step: 3, title: 'HR Round', description: 'Verification, documentation, and joining location preferences.' }
    ],
    openRoles: [
      {
        id: 'role-infy-1',
        title: 'Specialist Programmer (SP)',
        department: 'Advanced Engineering Services',
        location: 'Bengaluru',
        type: 'Full-time',
        salary: '₹8.0–9.5 LPA',
        minLPA: 8.0,
        maxLPA: 9.5,
        openings: 80,
        requirements: ['High percentile in HackWithInfy coding rounds', 'Strong problem solving in Java / Python']
      }
    ]
  },
  {
    id: 'comp-9',
    name: 'PayPal',
    logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=80',
    industry: 'FinTech & Digital Payments',
    description: 'PayPal is at the forefront of the digital payment revolution for more than 20 years, making financial services more convenient and secure for millions.',
    website: 'https://careers.pypl.com',
    headquarters: 'San Jose, CA (India Tech Centers: Chennai & Bengaluru)',
    locations: ['Chennai', 'Bengaluru'],
    salaryDisplay: '₹16–24 LPA',
    minLPA: 16,
    maxLPA: 24,
    requiredSkills: ['Java', 'Spring Boot', 'REST API', 'SQL', 'Data Structures & Algorithms', 'Microservices'],
    preferredSkills: ['Kafka', 'Docker', 'React', 'Distributed Caching', 'Kubernetes'],
    minimumCgpa: 7.5,
    companySize: '30,000+ Employees',
    hiringStatus: 'Currently Hiring',
    tier: 'Dream / Tier-1',
    rating: 4.6,
    applicationDeadline: '2026-09-20',
    techStack: ['Java', 'Spring Boot', 'Node.js', 'React', 'Oracle', 'Kafka', 'GCP'],
    benefits: ['High Base Pay + Stock Options', 'Comprehensive Health Plan', 'Wellness Allowance', 'Generous Paid Time Off'],
    hiringProcess: [
      { step: 1, title: 'HackerRank Online Assessment', description: '3 coding challenges on strings, arrays, and graph trees.' },
      { step: 2, title: 'Technical Round 1: DSA & Problem Solving', description: 'Optimization techniques and algorithm design.' },
      { step: 3, title: 'Technical Round 2: Java & System Design', description: 'Multithreading, concurrency, microservice communication, and DB transactions.' },
      { step: 4, title: 'Director & Culture Fit Interview', description: 'Behavioral evaluation and team alignment.' }
    ],
    openRoles: [
      {
        id: 'role-pp-1',
        title: 'Software Engineer - Backend',
        department: 'Payment Processing & Risk Engine',
        location: 'Chennai',
        type: 'Full-time',
        salary: '₹17–23 LPA',
        minLPA: 17,
        maxLPA: 23,
        openings: 18,
        requirements: ['Proficiency in Java and OOP architecture', 'Familiarity with REST APIs and database design']
      }
    ]
  },
  {
    id: 'comp-10',
    name: 'Cisco Systems',
    logo: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=100&auto=format&fit=crop&q=80',
    industry: 'Networking & Cybersecurity',
    description: 'Cisco is the worldwide leader in technology that powers the Internet, inspiring new possibilities by reinventing applications and securing your data.',
    website: 'https://www.cisco.com/careers',
    headquarters: 'San Jose, CA (India HQ: Bengaluru)',
    locations: ['Bengaluru', 'Chennai'],
    salaryDisplay: '₹14–20 LPA',
    minLPA: 14,
    maxLPA: 20,
    requiredSkills: ['Computer Networks', 'C++', 'Python', 'Linux', 'Data Structures & Algorithms'],
    preferredSkills: ['TCP/IP', 'Go', 'Docker', 'Cloud Networking', 'Git'],
    minimumCgpa: 7.5,
    companySize: '84,000+ Employees',
    hiringStatus: 'Currently Hiring',
    tier: 'Dream / Tier-1',
    rating: 4.5,
    applicationDeadline: '2026-09-28',
    techStack: ['C++', 'Python', 'Go', 'Linux', 'Docker', 'Kubernetes'],
    benefits: ['ESPP Stock Purchase Plan', 'Top Medical Coverage', 'Birthday Off Day', 'Tuition Assistance'],
    hiringProcess: [
      { step: 1, title: 'Cisco Ideathon / Online Test', description: 'Networking MCQs + Aptitude + 2 Coding Problems.' },
      { step: 2, title: 'Technical Interview', description: 'OSI layers, TCP vs UDP, socket programming, and memory pointers.' },
      { step: 3, title: 'Managerial Round', description: 'Problem-solving approach and situational scenarios.' },
      { step: 4, title: 'HR Round', description: 'Final terms, compensation, and onboarding roadmap.' }
    ],
    openRoles: [
      {
        id: 'role-cisco-1',
        title: 'Software Consulting Engineer',
        department: 'Enterprise Networking & Security',
        location: 'Bengaluru',
        type: 'Full-time',
        salary: '₹15–19 LPA',
        minLPA: 15,
        maxLPA: 19,
        openings: 22,
        requirements: ['Strong grasp of Computer Networks and Operating Systems', 'Proficiency in C++ or Python']
      }
    ]
  },
  {
    id: 'comp-11',
    name: 'Oracle',
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80',
    industry: 'Database & Cloud Infrastructure',
    description: 'Oracle offers integrated suites of applications plus secure, autonomous infrastructure in the Oracle Cloud.',
    website: 'https://oracle.com/careers',
    headquarters: 'Austin, TX (India HQ: Bengaluru & Hyderabad)',
    locations: ['Bengaluru', 'Hyderabad', 'Noida'],
    salaryDisplay: '₹14–22 LPA',
    minLPA: 14,
    maxLPA: 22,
    requiredSkills: ['Java', 'SQL', 'Database Management Systems', 'Data Structures & Algorithms', 'C++'],
    preferredSkills: ['Oracle Cloud', 'Distributed Systems', 'PL/SQL', 'Spring Boot'],
    minimumCgpa: 7.5,
    companySize: '140,000+ Employees',
    hiringStatus: 'Currently Hiring',
    tier: 'Dream / Tier-1',
    rating: 4.4,
    applicationDeadline: '2026-10-12',
    techStack: ['Java', 'C++', 'Oracle DB', 'OCI Cloud', 'Kubernetes'],
    benefits: ['Flexible Work Options', 'Health & Dental Plans', 'Stock Purchase Plan', 'Gym & Recreation Facilities'],
    hiringProcess: [
      { step: 1, title: 'Oracle Online Assessment', description: 'Aptitude, Core CS (DBMS, OS), and 2 coding tasks.' },
      { step: 2, title: 'Technical Interview 1', description: 'Deep dive into SQL queries, indexing, normalization, and ACID properties.' },
      { step: 3, title: 'Technical Interview 2', description: 'DSA, algorithmic complexity, and Java language internals.' },
      { step: 4, title: 'HR Round', description: 'Behavioral checks and offer discussion.' }
    ],
    openRoles: [
      {
        id: 'role-ora-1',
        title: 'Associate Software Engineer',
        department: 'Oracle Cloud Infrastructure (OCI)',
        location: 'Bengaluru',
        type: 'Full-time',
        salary: '₹15–20 LPA',
        minLPA: 15,
        maxLPA: 20,
        openings: 30,
        requirements: ['Solid understanding of DBMS and SQL query optimization', 'Proficiency in Java or C++']
      }
    ]
  },
  {
    id: 'comp-12',
    name: 'Cognizant',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop&q=80',
    industry: 'IT Services & Digital Operations',
    description: 'Cognizant engineers modern businesses, helping clients modernize technology, reimagine processes, and transform experiences.',
    website: 'https://www.cognizant.com/careers',
    headquarters: 'Teaneck, NJ (India HQ: Chennai)',
    locations: ['Chennai', 'Bengaluru', 'Hyderabad', 'Coimbatore', 'Kochi', 'Pune'],
    salaryDisplay: '₹4.0–9.0 LPA (GenC / GenC Elevate / GenC Next)',
    minLPA: 4.0,
    maxLPA: 9.0,
    requiredSkills: ['Java', 'SQL', 'Python', 'HTML/CSS', 'JavaScript', 'Communication Skills'],
    preferredSkills: ['React', 'Spring Boot', 'Cloud Fundamentals', 'Git'],
    minimumCgpa: 6.0,
    companySize: '350,000+ Employees',
    hiringStatus: 'Currently Hiring',
    tier: 'Core IT / Mass',
    rating: 4.1,
    applicationDeadline: '2026-10-30',
    techStack: ['Java', 'Spring', 'React', 'SQL Server', 'Azure'],
    benefits: ['Continuous Learning Programs', 'Comprehensive Health Insurance', 'Shift Allowances'],
    hiringProcess: [
      { step: 1, title: 'Cognizant GenC Online Assessment', description: 'Aptitude, logical analysis, and coding assessment.' },
      { step: 2, title: 'Technical Interview', description: 'Basic programming syntax, SQL queries, and final year project review.' },
      { step: 3, title: 'HR Round', description: 'Communication skills and shift readiness.' }
    ],
    openRoles: [
      {
        id: 'role-cts-1',
        title: 'GenC Next Software Engineer',
        department: 'Digital Modernization',
        location: 'Chennai',
        type: 'Full-time',
        salary: '₹6.75–9.0 LPA',
        minLPA: 6.75,
        maxLPA: 9.0,
        openings: 90,
        requirements: ['High score in GenC Next skill assessment', 'Strong foundational skills in Fullstack or Cloud']
      }
    ]
  }
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-1',
    studentId: 'user-1',
    studentName: 'Sasidharan R',
    companyId: 'comp-1',
    companyName: 'Zoho Corporation',
    companyLogo: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=100&auto=format&fit=crop&q=80',
    roleId: 'role-zoho-1',
    roleTitle: 'Software Engineer',
    status: 'Technical Interview',
    appliedDate: '2026-08-10',
    lastUpdated: '2026-08-20',
    matchScore: 92,
    salary: '₹6–10 LPA',
    location: 'Chennai',
    notes: 'Cleared Round 1 & Round 2 coding assessment. App development round scheduled for next Tuesday.',
    nextRoundDate: '2026-09-02'
  },
  {
    id: 'app-2',
    studentId: 'user-1',
    studentName: 'Sasidharan R',
    companyId: 'comp-3',
    companyName: 'Freshworks',
    companyLogo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&auto=format&fit=crop&q=80',
    roleId: 'role-fw-1',
    roleTitle: 'Full Stack Developer',
    status: 'Assessment',
    appliedDate: '2026-08-14',
    lastUpdated: '2026-08-18',
    matchScore: 88,
    salary: '₹10–14 LPA',
    location: 'Chennai',
    notes: 'Online coding link received on HackerEarth. Test link active until weekend.',
    nextRoundDate: '2026-08-30'
  },
  {
    id: 'app-3',
    studentId: 'user-1',
    studentName: 'Sasidharan R',
    companyId: 'comp-6',
    companyName: 'Accolite Digital',
    companyLogo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=100&auto=format&fit=crop&q=80',
    roleId: 'role-acc-1',
    roleTitle: 'Software Engineer',
    status: 'HR',
    appliedDate: '2026-08-01',
    lastUpdated: '2026-08-22',
    matchScore: 85,
    salary: '₹8–11 LPA',
    location: 'Chennai',
    notes: 'Cleared technical round 1 and 2. Final HR compensation discussion scheduled.',
    nextRoundDate: '2026-08-28'
  },
  {
    id: 'app-4',
    studentId: 'user-1',
    studentName: 'Sasidharan R',
    companyId: 'comp-4',
    companyName: 'TCS',
    companyLogo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop&q=80',
    roleId: 'role-tcs-1',
    roleTitle: 'TCS Digital / Prime Engineer',
    status: 'Selected',
    appliedDate: '2026-07-20',
    lastUpdated: '2026-08-15',
    matchScore: 94,
    salary: '₹7.2–9.0 LPA',
    location: 'Chennai',
    notes: 'Offer letter received for TCS Digital cadre! Awaiting onboarding details.',
  }
];

export const PLACEMENT_METRICS: PlacementStats = {
  totalStudents: 428,
  totalCompanies: 86,
  totalApplications: 1284,
  recommendationsGenerated: 3420,
  averageMatchScore: 85,
  placedStudentsCount: 312
};

export const FAQ_DATA = [
  {
    question: "How does the AI Company Recommendation Engine match students?",
    answer: "Our engine uses a multi-factor weighted matching algorithm. It evaluates your skills (30%), CGPA eligibility (15%), preferred role (15%), location alignment (10%), project relevance (10%), certifications (5%), experience level (5%), aptitude score (5%), and communication score (5%). Each component is scored out of 100 and combined into an overall compatibility percentage."
  },
  {
    question: "Can I upload my PDF resume to analyze skills automatically?",
    answer: "Yes! The Resume Analyzer uses intelligent text extraction to detect technical skills, programming languages, academic details, and project work directly from your PDF or Word document, calculating an ATS compatibility score and identifying skill gaps."
  },
  {
    question: "How are missing skills and preparation roadmaps generated?",
    answer: "When evaluating your profile against a company's job requirements, the engine compares required skills against your verified profile tags. Missing or beginner-level skills are flagged, and the system generates a tailored 5-step preparation roadmap to help you prepare for technical interviews."
  },
  {
    question: "Can I save companies and track my job applications?",
    answer: "Yes, you can bookmark high-matching companies to your Saved list and manage your live job applications through the Kanban Application Tracker across 6 distinct stages: Applied, Assessment, Technical Interview, HR, Selected, and Rejected."
  },
  {
    question: "How does the Admin / Placement Cell portal work?",
    answer: "Placement officers can monitor department-wide placement KPIs, view skill distribution charts, add and update company listings, set minimum CGPA criteria, and view real-time student placement statuses."
  }
];

export const TESTIMONIALS = [
  {
    name: "Kavitha Raman",
    degree: "B.Tech CSE, Batch 2026",
    company: "Placed at Zoho Corp",
    quote: "The skill gap suggestions helped me learn Spring Boot and prepare for the machine coding round. Got placed with a 92% match score!",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
  },
  {
    name: "Rohit Verma",
    degree: "B.Tech IT, Batch 2026",
    company: "Placed at PayPal",
    quote: "The transparent breakdown showed me exactly why certain companies were recommended. The preparation roadmap was spot on for FinTech interviews.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
  },
  {
    name: "Ananya Deshmukh",
    degree: "B.Tech ECE, Batch 2026",
    company: "Placed at Cisco",
    quote: "Uploading my resume instantly populated my skill matrix and highlighted the exact networking concepts I needed to revise.",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80"
  }
];
