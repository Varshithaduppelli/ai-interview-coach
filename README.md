# 🤖 AI Interview Coach Pro

> A production-grade MERN stack application that helps developers ace technical interviews using GPT-4o feedback and Whisper voice transcription.

[![CI](https://github.com/yourusername/ai-interview-coach/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/ai-interview-coach/actions)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-20%2B-green)
![React](https://img.shields.io/badge/react-18-blue)

## 🎯 Live Demo

🌐 **[ai-interview-coach.vercel.app](https://ai-interview-coach.vercel.app)** ← Frontend  
🔗 **API:** [api-interview-coach.onrender.com](https://api-interview-coach.onrender.com/api/health)

---

## ✨ Features

| Feature | Description |
|---------|------------|
| 🎙️ **Voice recording** | Record answers via microphone; Whisper API transcribes speech to text |
| 🧠 **GPT-4o feedback** | Instant scoring (1–10), strengths, improvements, model answer per question |
| 📊 **Analytics dashboard** | Score history charts, category radar, session history |
| 🔁 **AI follow-ups** | GPT-4o generates contextual follow-up questions from your answer |
| 🔐 **JWT auth** | Secure register/login with bcrypt password hashing |
| 📱 **Responsive UI** | Fully responsive dark-theme React app with Tailwind CSS |
| 🚀 **CI/CD pipeline** | GitHub Actions workflow with automated build checks |
| 🛡️ **Rate limiting** | Express rate-limit + Helmet security headers |

---

## 🏗️ Architecture

```
ai-interview-coach/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── pages/          # LandingPage, Login, Register, Dashboard, Interview, Results
│   │   ├── components/     # Navbar, reusable UI
│   │   ├── context/        # AuthContext (JWT + axios interceptors)
│   │   └── index.css       # Tailwind + custom animations
│   └── vite.config.js
│
├── server/                 # Node.js + Express backend
│   ├── controllers/        # auth, interview (AI core), dashboard, questions
│   ├── models/             # User, Session, Question (Mongoose)
│   ├── routes/             # REST API routes
│   ├── middleware/         # JWT auth middleware
│   ├── services/           # openai.service.js (GPT-4o + Whisper)
│   └── index.js            # App entry with helmet, cors, rate-limit
│
└── .github/workflows/      # GitHub Actions CI
```

---

## 🧠 AI Integrations

### GPT-4o Feedback Engine
Each interview answer is evaluated by GPT-4o on a structured rubric:
- **Overall score** (1–10)
- **Confidence, Clarity, Relevance** sub-scores
- **Strengths** — what the candidate did well
- **Improvements** — specific areas to fix
- **Model answer** — example of an ideal response
- **Keywords used / missed** — technical terms check

### Whisper Speech-to-Text
- Records audio using the `MediaRecorder` browser API
- Sends `audio/webm` blob to backend via `multipart/form-data`
- Backend pipes the file to OpenAI Whisper API for transcription
- Transcribed text is then evaluated by GPT-4o

### AI Session Summary
After completing all questions, GPT-4o generates:
- Overall performance summary
- Topics to improve
- Estimated seniority level (junior/mid/senior)
- 3-step personalised study plan
- Interview readiness flag

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- MongoDB Atlas account (free tier works)
- OpenAI API key

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/ai-interview-coach.git
cd ai-interview-coach
```

### 2. Install dependencies
```bash
npm run install:all
```

### 3. Configure environment variables

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/interview-coach
JWT_SECRET=your_super_secret_key_here
OPENAI_API_KEY=sk-your-openai-key
CLIENT_URL=http://localhost:5173
```

### 4. Seed the question bank
```bash
curl -X POST http://localhost:5000/api/questions/seed
```

### 5. Run the app
```bash
# From root directory — starts both client and server
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## 📡 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Create account |
| `POST` | `/api/auth/login` | Login, receive JWT |
| `GET` | `/api/auth/profile` | Get current user |

### Interview
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/interview/start` | Start session, get questions |
| `POST` | `/api/interview/answer/text` | Submit text answer → GPT feedback |
| `POST` | `/api/interview/answer/voice` | Submit audio → Whisper → GPT feedback |
| `POST` | `/api/interview/complete` | Finalize session, get AI summary |
| `POST` | `/api/interview/followup` | Generate AI follow-up question |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/dashboard/stats` | Score history, category breakdown |
| `GET` | `/api/dashboard/session/:id` | Full session with Q&A details |

---

## 🚢 Deployment

### Frontend → Vercel
```bash
cd client
npm run build
# Deploy dist/ to Vercel
# Set VITE_API_URL env var to your Render URL
```

### Backend → Render
1. Connect GitHub repo to Render
2. Set build command: `cd server && npm install`
3. Set start command: `cd server && node index.js`
4. Add environment variables (MONGO_URI, JWT_SECRET, OPENAI_API_KEY)

### Database → MongoDB Atlas
1. Create free cluster at mongodb.com
2. Whitelist `0.0.0.0/0` for Render's dynamic IPs
3. Copy connection string to `MONGO_URI`

---

## 🛡️ Security Features
- Passwords hashed with **bcrypt** (12 salt rounds)
- **JWT** tokens expire in 7 days
- **Helmet.js** sets 15+ security HTTP headers
- **Rate limiting**: 100 requests / 15 minutes per IP
- Audio files deleted immediately after Whisper transcription
- Input validation on all routes

---

## 🧪 Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, React Router v6, Recharts, Framer Motion, Lucide Icons  
**Backend:** Node.js, Express.js, Mongoose, JWT, Bcrypt, Multer, Helmet  
**Database:** MongoDB Atlas  
**AI:** OpenAI GPT-4o (feedback), Whisper-1 (voice transcription)  
**Deployment:** Vercel (frontend) + Render (backend) + MongoDB Atlas  
**CI/CD:** GitHub Actions  

---

## 📸 Screenshots

> Dashboard with score analytics, Interview UI with voice recording, Results page with AI summary

---

## 📄 License

MIT © 2025 — Built with ❤️ using MERN + OpenAI
