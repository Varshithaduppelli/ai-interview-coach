# AI Interview Coach Pro

> A production-grade MERN stack application that helps developers ace technical interviews using AI-powered feedback and voice transcription.

![Node](https://img.shields.io/badge/node-20%2B-green)
![React](https://img.shields.io/badge/react-18-blue)
![License](https://img.shields.io/badge/license-MIT-blue)
![Live](https://img.shields.io/badge/live-vercel-black)

**Live Demo:** [ai-interview-coach-bice.vercel.app](https://ai-interview-coach-bice.vercel.app)

---

## Features

- **Voice recording** — Record answers via microphone with Groq Whisper transcription
- **AI feedback** — Instant scoring (1-10), strengths, improvements, model answer per question
- **Question timer** — 2-minute countdown per question
- **Analytics dashboard** — Score history charts, category breakdown, session tracking
- **AI follow-ups** — Contextual follow-up questions generated from your answer
- **JWT authentication** — Secure register/login with bcrypt password hashing
- **Responsive UI** — Dark-theme React app with Tailwind CSS

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Recharts, Lucide Icons |
| Backend | Node.js, Express.js, Mongoose, JWT, Multer |
| Database | MongoDB Atlas |
| AI | Groq AI — LLaMA 3.3 (feedback) + Whisper Large v3 (voice) |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/Varshithaduppelli/ai-interview-coach.git
cd ai-interview-coach
npm run install:all
```

### 2. Configure Environment Variables

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/interview-coach?retryWrites=true&w=majority
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_groq_api_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Seed Questions and Run

```bash
# Seed the question bank
curl -X POST http://localhost:5000/api/questions/seed

# Start development server
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## Project Structure

```
ai-interview-coach/
├── client/
│   └── src/
│       ├── pages/
│       ├── components/
│       └── context/
└── server/
    ├── controllers/
    ├── models/
    ├── routes/
    ├── services/
    └── config/
```

## Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | [ai-interview-coach-bice.vercel.app](https://ai-interview-coach-bice.vercel.app) |
| Backend | Render | [ai-interview-coach-rcld.onrender.com](https://ai-interview-coach-rcld.onrender.com) |
| Database | MongoDB Atlas | Cloud hosted |

---

## License

MIT © 2025 — Built with MERN stack + Groq AI
