import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { api, useAuth } from '../context/AuthContext';
import { Play, Trophy, Flame, Target, TrendingUp, AlertCircle, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

function ScoreCard({ label, value, icon, color = 'text-blue-400' }) {
  return (
    <div className="card">
      <div className="flex items-start justify-between mb-3">
        <span className="text-slate-400 text-sm">{label}</span>
        <span className={color}>{icon}</span>
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(res => setStats(res.data))
      .catch(() => toast.error('Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
    </div>
  );

  const categoryData = stats?.categoryAvgs?.map(c => ({
    subject: c.category.charAt(0).toUpperCase() + c.category.slice(1),
    score: c.avgScore,
    fullMark: 10
  })) || [];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-slate-400 mt-1">Targeting: <span className="text-blue-400">{user?.targetRole}</span></p>
        </div>
        <Link to="/interview" className="btn-primary flex items-center gap-2">
          <Play className="w-4 h-4" /> Start interview
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <ScoreCard label="Total sessions" value={stats?.totalSessions || 0} icon={<Trophy className="w-5 h-5" />} />
        <ScoreCard label="Average score" value={`${stats?.avgScore || 0}/10`} icon={<Target className="w-5 h-5" />} color="text-green-400" />
        <ScoreCard label="Practice streak" value={`${stats?.streak || 0} days`} icon={<Flame className="w-5 h-5" />} color="text-orange-400" />
        <ScoreCard label="Trend" value={stats?.scoreHistory?.length > 1 ? '↑ Improving' : 'Keep going!'} icon={<TrendingUp className="w-5 h-5" />} color="text-purple-400" />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {stats?.scoreHistory?.length > 0 && (
          <div className="card">
            <h2 className="font-semibold text-white mb-4">Score history</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stats.scoreHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" tickFormatter={d => new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric' })} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis domain={[0, 10]} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} labelFormatter={d => new Date(d).toLocaleDateString()} />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', strokeWidth: 0, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {categoryData.length > 0 && (
          <div className="card">
            <h2 className="font-semibold text-white mb-4">Category breakdown</h2>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={categoryData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {stats?.topicsToImprove?.length > 0 && (
        <div className="card mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <h2 className="font-semibold text-white">Topics to improve</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {stats.topicsToImprove.map(t => (
              <span key={t} className="badge bg-amber-900/40 text-amber-300 border border-amber-700/40">{t}</span>
            ))}
          </div>
        </div>
      )}

      {stats?.recentSessions?.length > 0 && (
        <div className="card">
          <h2 className="font-semibold text-white mb-4">Recent sessions</h2>
          <div className="space-y-3">
            {stats.recentSessions.map(s => (
              <Link to={`/results/${s._id}`} key={s._id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 transition-colors group">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium capitalize">{s.type}</span>
                    <span className={`badge text-xs ${s.difficulty === 'hard' ? 'bg-red-900/40 text-red-300' : s.difficulty === 'medium' ? 'bg-yellow-900/40 text-yellow-300' : 'bg-green-900/40 text-green-300'}`}>{s.difficulty}</span>
                  </div>
                  <p className="text-sm text-slate-400 mt-0.5">{s.totalQuestions} questions · {new Date(s.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className={`text-lg font-bold ${s.avgScore >= 7 ? 'text-green-400' : s.avgScore >= 5 ? 'text-yellow-400' : 'text-red-400'}`}>{s.avgScore}/10</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {stats?.totalSessions === 0 && (
        <div className="text-center py-16 card">
          <Trophy className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Ready to start practicing?</h2>
          <p className="text-slate-400 mb-6">Complete your first mock interview to see your stats here.</p>
          <Link to="/interview" className="btn-primary inline-flex items-center gap-2"><Play className="w-4 h-4" /> Start now</Link>
        </div>
      )}
    </div>
  );
}
