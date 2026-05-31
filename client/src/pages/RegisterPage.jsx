import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Brain, User, Mail, Lock, Briefcase } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', targetRole: 'Software Engineer' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const roles = ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Scientist', 'DevOps Engineer', 'Product Manager'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.targetRole);
      toast.success('Account created! Welcome aboard 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">InterviewAI</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-slate-400 mt-1">Start practicing interviews in seconds</p>
        </div>
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">Full name</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                <input className="input pl-10" placeholder="John Doe" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                <input type="email" className="input pl-10" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                <input type="password" className="input pl-10" placeholder="Min 6 characters" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">Target role</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                <select className="input pl-10 appearance-none" value={form.targetRole} onChange={e => setForm({...form, targetRole: e.target.value})}>
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating account...' : 'Create account →'}
            </button>
          </form>
          <p className="text-center text-slate-400 text-sm mt-4">
            Already have an account? <Link to="/login" className="text-blue-400 hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
