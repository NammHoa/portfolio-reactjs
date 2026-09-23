import grade10Cover from '../assets/projects/grade10-cover.jpg'
import sunliesCover from '../assets/projects/sunilies-cover.jpg'
import leadLogo from '../assets/projects/lead-logo.png'

const RAW_PROJECTS = [
  {
    name: 'Grade 10 Enrollment Registration System',
    role: 'Fullstack Developer · Team of 2',
    period: 'Jun 2026 – Aug 2026',
    headlineLines: ['Enrollment,', 'without the chaos.'],
    description:
      'A full-stack registration for THPT Ham Thuan Nam, handling 600+ students with dynamic subject-combination logic, real-time status tracking, and an asynchronous email queue for automated confirmations.',
    highlights: [
      'Admin dashboard with Chart.js analytics',
      'Excel import/export via PhpSpreadsheet',
      'BCrypt hashing, CSRF protection, brute-force rate limiting, and SQL-injection-safe prepared statements',
    ],
    tags: ['PHP 8.1', 'MySQL', 'HTML/CSS', 'JavaScript'],
    link: 'https://nguyenvong.thpthamthuannam.edu.vn/',
    image: grade10Cover,
    imageAspect: '1024 / 489',
  },
  {
    name: 'SUNILIES',
    role: 'Fullstack Developer · Team of 2',
    period: 'Feb 2026 – Jun 2026',
    headlineLines: ['Commerce,', 'secured end to end.'],
    description:
      'An e-commerce covering product management, order processing, and user authentication, with MoMo Payment Gateway integrated for real-time transaction confirmation.',
    highlights: [
      'HMAC-SHA256 signed MoMo payments with async IPN webhook handling',
      'Firebase Storage, Stringee Voice OTP, and JavaMail integrations',
      'Session-fixation prevention, brute-force rate limiting, and XSS sanitization',
    ],
    tags: ['Spring Boot', 'Thymeleaf', 'Firebase', 'MoMo API'],
    link: 'https://sunilies.vn/',
    image: sunliesCover,
    imageAspect: '1024 / 487',
  },
  {
    name: 'Sample Management System',
    role: 'Fullstack Mobile Dev Intern · Team of 6',
    period: 'Aug 2025 – Nov 2025',
    headlineLines: ['Lab work,', 'digitized.'],
    description:
      'A mobile solution that digitizes laboratory workflows — from sample tracking to automated reporting — independently owned end-to-end within a 6-person team.',
    highlights: [
      'Structured schema managing 10+ critical field parameters',
      'Role-based access control segregating permissions across departments',
      'Real-time data synchronization with change-log auditing',
    ],
    tags: ['Flutter', 'Node.js', 'Firebase'],
    link: 'https://leaderp.vn/',
    logo: leadLogo,
    company: 'Lead Management Solutions',
  },
  {
    name: 'Viren',
    role: 'Personal Project · Solo Developer',
    period: 'May 2025 – July 2025',
    headlineLines: ['Bookstore,', 'in your pocket.'],
    description:
      'A cross-platform mobile app for browsing and buying books, backed by a RESTful API with real-time payments and full inventory logic — built end-to-end from scratch.',
    highlights: [
      'State Management: Utilized Provider to ensure smooth UI performance and efficient data handling.',
      'Payment Integration: Integrated MoMo API for secure, real-time online transactions.',
      'Database & Logic: Designed SQL Server schemas and implemented shopping cart, search filters, and user authentication.',
    ],
    tags: ['Flutter', 'ASP.NET Core API', 'SQL Server', 'MoMo Payment'],
    link: 'https://github.com/NammHoa/Viren',
    linkLabel: 'Github',
  },
  {
    name: 'TheGioijack',
    role: 'Personal Project · Solo Developer',
    period: 'November 2024 – March 2025',
    headlineLines: ['Electronics,', 'sold online.'],
    description:
      'An independently built e-commerce platform for electronic devices, covering the full stack from product catalog and cart to secure checkout and order management.',
    highlights: [
      'State Management: Leveraged Redux for efficient and predictable state management across the application.',
      'API & Backend: Implemented RESTful APIs with Express.js to manage products, user accounts, and order processing.',
      'Security: Developed a secure JWT-based authentication and authorization system.',
      'Database: Integrated MongoDB to handle scalable data storage for users and transactions.',
    ],
    tags: ['React.js', 'Redux', 'Node.js', 'Express.js', 'MongoDB', 'JWT'],
    links: [
      { label: 'Frontend', href: 'https://github.com/NammHoa/TheGioiJack' },
      { label: 'Backend', href: 'https://github.com/NammHoa/TheGioiJack_be' },
    ],
  },
]

export const ALL_PROJECTS = RAW_PROJECTS.map((project, i) => ({
  ...project,
  index: String(i + 1).padStart(2, '0'),
}))

export const EXPERIENCE_PROJECTS = ALL_PROJECTS.slice(0, 3)
export const PORTFOLIO_PROJECTS = ALL_PROJECTS.slice(3)
