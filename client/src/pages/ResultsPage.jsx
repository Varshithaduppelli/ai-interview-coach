import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy, Target, Clock, ChevronDown, ChevronUp, Brain, Play, LayoutDashboard } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ResultsPage() {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedIdx, setExpandedIdx] = useState(null);

  useEffect(() => {
    api.get(`/dashboard/session/${sessionId}`)
      .then(res => setSession(res.data))
      .catch(() => toast.error('Failed to load results'))
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" /></div>;
  if (!session) return <div className="text-center py-20 text-slate-400">Session not found</div>;

  const scoreColor = (s) => s >= 7 ? 'text-green-400' : s >= 5 ? 'text-yellow-400' : 'text-red-400';
  const chartData = session.answers.map((a, i) => ({ name: `Q${i + 1}`, score: a.score, fill: a.score >= 7 ? '#22c55e' : a.score >= 5 ? '#eab308' : '#ef4444' }));

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 bg-blue-600/20 rounded-full flex items-center justify-center">
          <Trophy className="w-10 h-10 text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Interview complete!</h1>
        <p className="text-slate-400 capitalize">{session.type} · {session.difficulty} · {session.answers.length} questions</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card text-center">
          <div className="text-slate-400 text-sm mb-1">Average score</div>
          <div className={`text-4xl font-bold ${scoreColor(session.avgScore)}`}>{session.avgScore}/10</div>
        </div>
        <div className="card text-center">
          <div className="text-slate-400 text-sm mb-1">Total score</div>
          <div className="text-4xl font-bold text-white">{session.totalScore}</div>
        </div>
        <div className="card text-center">
          <div className="text-slate-400 text-sm mb-1">Questions</div>
          <div className="text-4xl font-bold text-white">{session.answers.length}</div>
        </div>
      </div>

      {session.aiSummary && (
        <div className="card mb-6 bg-blue-900/20 border-blue-800/40">
          <div className="flex items-center gap-2 mb-3"><Brain className="w-5 h-5 text-blue-400" /><h2 className="font-semibold text-white">AI performance summary</h2></div>
          <p className="text-slate-300">{session.aiSummary}</p>
        </div>
      )}

      {session.topicsToImprove?.length > 0 && (
        <div className="card mb-6">
          <h2 className="font-semibold text-white mb-3">Topics to focus on</h2>
          <div className="flex flex-wrap gap-2">
            {session.topicsToImprove.map(t => <span key={t} className="badge bg-amber-900/40 text-amber-300 border border-amber-700/40">{t}</span>)}
          </div>
        </div>
      )}

      <div className="card mb-6">
        <h2 className="font-semibold text-white mb-4">Score per question</h2>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} />
            <YAxis domain={[0, 10]} tick={{ fill: '#94a3b8' }} />
            <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
            <Bar dataKey="score" radius={[4, 4, 0, 0]} fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card mb-8">
        <h2 className="font-semibold text-white mb-4">Answer breakdown</h2>
        <div className="space-y-3">
          {session.answers.map((answer, i) => (
            <div key={i} className="border border-slate-700 rounded-xl overflow-hidden">
              <button onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-700/50 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${answer.score >= 7 ? 'bg-green-900/60 text-green-400' : answer.score >= 5 ? 'bg-yellow-900/60 text-yellow-400' : 'bg-red-900/60 text-red-400'}`}>{answer.score}</div>
                  <p className="text-white text-sm font-medium line-clamp-1">{answer.questionText}</p>
                </div>
                {expandedIdx === i ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
              </button>
              {expandedIdx === i && (
                <div className="px-4 pb-4 space-y-3 border-t border-slate-700 pt-4">
                  <div><p className="text-xs text-slate-500 uppercase mb-1">Your answer</p><p className="text-slate-300 text-sm">{answer.answerText}</p></div>
                  {answer.feedback?.overall && <div><p className="text-xs text-slate-500 uppercase mb-1">Feedback</p><p className="text-slate-300 text-sm">{answer.feedback.overall}</p></div>}
                  {answer.feedback?.sampleAnswer && <div className="bg-blue-900/20 rounded-lg p-3"><p className="text-xs text-blue-400 uppercase mb-1">Model answer</p><p className="text-slate-300 text-sm">{answer.feedback.sampleAnswer}</p></div>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <Link to="/interview" className="btn-primary flex items-center gap-2"><Play className="w-4 h-4" /> Practice again</Link>
        <Link to="/dashboard" className="btn-secondary flex items-center gap-2"><LayoutDashboard className="w-4 h-4" /> Dashboard</Link>
      </div>
    </div>
  );
}
