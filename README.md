# ?? AI Interview Coach Pro

> A production-grade MERN stack application that helps developers ace technical interviews using AI feedback and voice transcription.

![Node](https://img.shields.io/badge/node-20%2B-green)
![React](https://img.shields.io/badge/react-18-blue)
![License](https://img.shields.io/badge/license-MIT-blue)

## ? Features

- ??? **Voice recording** — Record answers via microphone with Groq Whisper transcription
- ?? **AI feedback** — Instant scoring (1–10), strengths, improvements, model answer
- ?? **Question timer** — 2-minute countdown per question
- ?? **Analytics dashboard** — Score history charts, category breakdown
- ?? **AI follow-ups** — Contextual follow-up questions from your answer
- ?? **JWT auth** — Secure register/login with bcrypt password hashing
- ?? **Responsive UI** — Dark-theme React app with Tailwind CSS

## ??? Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, Recharts, Lucide Icons  
**Backend:** Node.js, Express.js, Mongoose, JWT, Multer  
**Database:** MongoDB Atlas  
**AI:** Groq AI — LLaMA 3.3 (feedback) + Whisper Large v3 (voice)  
**Deployment:** Vercel (frontend) + Render (backend)

## ?? Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/Varshithaduppelli/ai-interview-coach.git
cd ai-interview-coach
npm run install:all
```

### 2. Configure server/.env
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/interview-coach?retryWrites=true&w=majority
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_groq_api_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Seed questions & Run
```bash
curl -X POST http://localhost:5000/api/questions/seed
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## ?? License

MIT © 2025 — Built with ?? using MERN + Groq AI
