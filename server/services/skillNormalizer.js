/**
 * Skill Normalization and Semantic Matching Service
 * Normalizes variations (e.g. React.js / ReactJS / React -> React)
 * and evaluates compatibility.
 */

const CANONICAL_MAP = {
  // Frontend
  'react': 'React',
  'react.js': 'React',
  'reactjs': 'React',
  'react native': 'React Native',
  'vue': 'Vue.js',
  'vue.js': 'Vue.js',
  'vuejs': 'Vue.js',
  'angular': 'Angular',
  'angularjs': 'Angular',
  'angular.js': 'Angular',
  'next.js': 'Next.js',
  'nextjs': 'Next.js',
  'html': 'HTML/CSS',
  'css': 'HTML/CSS',
  'html5': 'HTML/CSS',
  'css3': 'HTML/CSS',
  'html/css': 'HTML/CSS',
  'tailwind': 'Tailwind CSS',
  'tailwind css': 'Tailwind CSS',
  'tailwindcss': 'Tailwind CSS',
  'bootstrap': 'Bootstrap',

  // Backend & Languages
  'node': 'Node.js',
  'node.js': 'Node.js',
  'nodejs': 'Node.js',
  'express': 'Express',
  'express.js': 'Express',
  'expressjs': 'Express',
  'java': 'Java',
  'core java': 'Java',
  'advanced java': 'Java',
  'spring': 'Spring Boot',
  'spring boot': 'Spring Boot',
  'springboot': 'Spring Boot',
  'spring-boot': 'Spring Boot',
  'python': 'Python',
  'python3': 'Python',
  'django': 'Django',
  'flask': 'Flask',
  'fastapi': 'FastAPI',
  'c++': 'C++',
  'cpp': 'C++',
  'c/c++': 'C++',
  'c': 'C',
  'c#': 'C#',
  'csharp': 'C#',
  'dotnet': '.NET',
  '.net': '.NET',
  'go': 'Go',
  'golang': 'Go',
  'rust': 'Rust',
  'ruby': 'Ruby',
  'ruby on rails': 'Ruby on Rails',
  'rails': 'Ruby on Rails',
  'php': 'PHP',
  'typescript': 'TypeScript',
  'ts': 'TypeScript',
  'javascript': 'JavaScript',
  'js': 'JavaScript',

  // Databases
  'sql': 'SQL',
  'mysql': 'MySQL',
  'postgresql': 'PostgreSQL',
  'postgres': 'PostgreSQL',
  'mongodb': 'MongoDB',
  'mongo': 'MongoDB',
  'redis': 'Redis',
  'oracle': 'Oracle DB',
  'oracle db': 'Oracle DB',
  'oracle database': 'Oracle DB',
  'sqlite': 'SQLite',
  'dynamodb': 'DynamoDB',

  // Architecture & Tools
  'rest': 'REST API',
  'rest api': 'REST API',
  'restful': 'REST API',
  'restful api': 'REST API',
  'rest services': 'REST API',
  'graphql': 'GraphQL',
  'microservices': 'Microservices',
  'microservice': 'Microservices',
  'git': 'Git',
  'github': 'Git',
  'docker': 'Docker',
  'kubernetes': 'Kubernetes',
  'k8s': 'Kubernetes',
  'aws': 'AWS',
  'amazon web services': 'AWS',
  'azure': 'Azure',
  'gcp': 'GCP',
  'google cloud': 'GCP',
  'ci/cd': 'CI/CD',
  'jenkins': 'CI/CD',

  // Core CS
  'dsa': 'Data Structures & Algorithms',
  'data structures': 'Data Structures & Algorithms',
  'algorithms': 'Data Structures & Algorithms',
  'data structures & algorithms': 'Data Structures & Algorithms',
  'data structures and algorithms': 'Data Structures & Algorithms',
  'oop': 'Object Oriented Programming',
  'oops': 'Object Oriented Programming',
  'object oriented programming': 'Object Oriented Programming',
  'dbms': 'DBMS',
  'database management systems': 'DBMS',
  'operating systems': 'Operating Systems',
  'os': 'Operating Systems',
  'computer networks': 'Computer Networks',
  'networking': 'Computer Networks',
  'cn': 'Computer Networks',
  'system design': 'System Design',

  // AI & Data Science
  'machine learning': 'Machine Learning',
  'ml': 'Machine Learning',
  'deep learning': 'Deep Learning',
  'dl': 'Deep Learning',
  'nlp': 'Natural Language Processing',
  'pandas': 'Pandas',
  'numpy': 'NumPy',
  'scikit-learn': 'Scikit-Learn',
  'sklearn': 'Scikit-Learn',
  'tensorflow': 'TensorFlow',
  'pytorch': 'PyTorch',
  'power bi': 'Power BI',
  'powerbi': 'Power BI',
  'tableau': 'Tableau'
};

export function normalizeSkill(skillName) {
  if (!skillName || typeof skillName !== 'string') return '';
  const clean = skillName.trim().toLowerCase();
  return CANONICAL_MAP[clean] || skillName.trim();
}

/**
 * Checks if a required skill is satisfied by a list of student skills
 */
export function isSkillMatched(requiredSkill, studentSkillsList) {
  const normRequired = normalizeSkill(requiredSkill).toLowerCase();

  return studentSkillsList.some(s => {
    const normStudent = normalizeSkill(s).toLowerCase();
    if (normStudent === normRequired) return true;
    if (normStudent.includes(normRequired) || normRequired.includes(normStudent)) return true;
    return false;
  });
}
