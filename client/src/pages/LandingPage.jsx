import { Link } from 'react-router-dom';
import { Brain, Mic, BarChart3, Zap, CheckCircle, Star } from 'lucide-react';

export default function LandingPage() {
  const features = [
    { icon: <Mic className="w-6 h-6" />, title: 'Voice interviews', desc: 'Record answers via microphone. Whisper AI transcribes and GPT-4o scores them.' },
    { icon: <Brain className="w-6 h-6" />, title: 'GPT-4o feedback', desc: 'Get instant, detailed feedback with strengths, improvements, and model answers.' },
    { icon: <BarChart3 className="w-6 h-6" />, title: 'Progress tracking', desc: 'Track your scores across sessions with interactive charts and trend analysis.' },
    { icon: <Zap className="w-6 h-6" />, title: 'Smart follow-ups', desc: 'AI generates contextual follow-up questions based on your answers.' },
  ];

  const stats = [{ value: '20+', label: 'Question types' }, { value: 'GPT-4o', label: 'AI model' }, { value: '10-point', label: 'Scoring rubric' }, { value: '100%', label: 'Free to try' }];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <Brain className="w-7 h-7 text-blue-400" />
          <span className="text-xl font-bold text-white">InterviewAI</span>
        </div>
        <div className="flex gap-3">
          <Link to="/login" className="btn-secondary text-sm py-2">Log in</Link>
          <Link to="/register" className="btn-primary text-sm py-2">Get started</Link>
        </div>
      </nav>

      <section className="text-center px-6 py-20 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-blue-900/40 border border-blue-700/50 rounded-full px-4 py-2 text-blue-300 text-sm mb-8">
          <Star className="w-4 h-4 fill-current" /> Powered by GPT-4o + Whisper
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Ace your next<br />
          <span className="text-blue-400">tech interview</span>
        </h1>
        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
          Practice with AI-powered mock interviews. Get instant GPT-4o feedback, voice recording support, and track your progress over time.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/register" className="btn-primary text-base px-8 py-3">Start practicing free →</Link>
          <Link to="/login" className="btn-secondary text-base px-8 py-3">I have an account</Link>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto px-6 mb-20">
        {stats.map(s => (
          <div key={s.label} className="text-center bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
            <div className="text-3xl font-bold text-blue-400 mb-1">{s.value}</div>
            <div className="text-sm text-slate-400">{s.label}</div>
          </div>
        ))}
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Everything you need to get hired</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map(f => (
            <div key={f.title} className="card flex gap-4">
              <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-400 shrink-0">{f.icon}</div>
              <div>
                <h3 className="font-semibold text-white mb-1">{f.title}</h3>
                <p className="text-slate-400 text-sm">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="text-center pb-20 px-6">
        <div className="card max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to get hired?</h2>
          <p className="text-slate-400 mb-6">Start your first mock interview in under 60 seconds.</p>
          <Link to="/register" className="btn-primary inline-block">Create free account →</Link>
        </div>
      </section>
    </div>
  );
}
