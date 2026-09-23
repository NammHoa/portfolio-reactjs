import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { connectDB } from './config/db.js'
import Project from './models/Project.js'

dotenv.config()

const PROJECTS = [
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
    imageAspect: '1024 / 489',
    category: 'experience',
    order: 1,
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
    imageAspect: '1024 / 487',
    category: 'experience',
    order: 2,
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
    company: 'Lead Management Solutions',
    category: 'experience',
    order: 3,
  },
  {
    name: 'Viren',
    role: 'Personal Project · Solo Developer',
    period: 'May 2025 – July 2025',
    headlineLines: ['Bookstore,', 'in your pocket.'],
    description:
      'A mobile app for browsing and buying books, backed by a RESTful API with real-time payments and full inventory logic — built end-to-end from scratch.',
    highlights: [
      'State Management: Utilized Provider to ensure smooth UI performance and efficient data handling.',
      'Payment Integration: Integrated MoMo API for secure, real-time online transactions.',
      'Database & Logic: Designed SQL Server schemas and implemented shopping cart, search filters, and user authentication.',
    ],
    tags: ['Flutter', 'ASP.NET Core API', 'SQL Server', 'MoMo Payment'],
    link: 'https://github.com/NammHoa/Viren',
    linkLabel: 'Github',
    category: 'project',
    order: 4,
  },
  {
    name: 'TheGioijack',
    role: 'Personal Project · Solo Developer',
    period: 'November 2024 – March 2025',
    headlineLines: ['Electronics,', 'sold online.'],
    description:
      'An independently built e-commerce for electronic devices, covering the full stack from product catalog and cart to secure checkout and order management.',
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
    category: 'project',
    order: 5,
  },
]

async function seed() {
  await connectDB()
  await Project.deleteMany({})
  await Project.insertMany(PROJECTS)
  console.log(`Seeded ${PROJECTS.length} projects`)
  await mongoose.disconnect()
  process.exit(0)
}

seed()
