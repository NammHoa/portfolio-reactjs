# Portfolio Website

Personal portfolio for Lam Huynh Hoa Nam — built with React (Vite) on the
frontend and a Node.js/Express + MongoDB API on the backend.

**Live:** [lamhuynhhoanam.vercel.app](https://lamhuynhhoanam.vercel.app/)

## Features

- Fullstack: work experience & side projects are fetched from a real API,
  not hardcoded data
- Contact form that saves messages to MongoDB and emails a notification
  via Gmail
- Client-side routing (React Router) with a shared layout and a 404 page
- Scroll-reveal animations, a shrinking/floating header on scroll
- Basic test coverage on both client and server (Vitest)

## Project structure

```
portfolio-reactjs/
├── client/                  # React app (Vite)
│   └── src/
│       ├── components/      # UI components
│       ├── pages/            # Route-level pages (Home, NotFound)
│       ├── layouts/          # Shared layout (Header + Outlet + Footer)
│       ├── context/          # ProjectModalContext (fetches + shares project data)
│       ├── lib/               # API client (fetch helpers)
│       ├── data/              # Locally-bundled project images/logos
│       └── hooks/             # useReveal, useTilt
└── server/                  # Express API
    └── src/
        ├── config/            # DB connection, mailer
        ├── controllers/       # Route handlers
        ├── models/            # Mongoose schemas
        ├── routes/            # Express routers
        ├── app.js             # Express app (exported, used by tests)
        └── server.js          # Boots the app (connect DB, then listen)
```

## Getting started

### Server

```bash
cd server
npm install
cp .env.example .env   # fill in the values below
npm run dev
```

Environment variables (`server/.env`):

| Variable | Description |
|---|---|
| `PORT` | Port the API listens on (default `5000`) |
| `MONGO_URI` | MongoDB connection string (local or Atlas) |
| `CLIENT_URL` | Origin allowed by CORS — the client's URL |
| `GMAIL_USER` | Gmail address used to send contact notifications |
| `GMAIL_APP_PASSWORD` | [Gmail App Password](https://myaccount.google.com/apppasswords) (not your normal password; requires 2-Step Verification) |

Seed the database with the initial project data:

```bash
npm run seed
```

### Client

```bash
cd client
npm install
npm run dev
```

Environment variables (`client/.env`, optional for local dev):

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend base URL (defaults to `http://localhost:5000`) |

## API

| Method | Route | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/projects` | List projects, sorted by `order` |
| POST | `/api/contact` | Save a contact message + send an email notification. Rate-limited to 5 requests / 15 min per IP |

## Testing

```bash
cd client && npm test
cd server && npm test
```

## Deployment

- **Client:** deployed on [Vercel](https://vercel.com), root directory `client`, with `VITE_API_URL` pointing at the deployed backend.
- **Server:** deployed on [Render](https://render.com), root directory `server`, build command `npm install`, start command `npm start`.
- **Database:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier.

When redeploying the client to a new domain, update the server's `CLIENT_URL`
environment variable on Render to match, or the API will reject requests due
to CORS.

## Tech stack

- **Frontend:** React 19, Vite, React Router
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB
- **Email:** Nodemailer (Gmail SMTP)
- **Testing:** Vitest, React Testing Library, Supertest
