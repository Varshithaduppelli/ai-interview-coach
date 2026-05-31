import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Brain, Mail, Lock, Eye, EyeOff } from 'lucide-react';

function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">InterviewAI</span>
          </div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="text-slate-400 mt-1">{subtitle}</p>
        </div>
        <div className="card">{children}</div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to continue your practice">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-slate-400 mb-1.5 block">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
            <input type="email" className="input pl-10" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
        </div>
        <div>
          <label className="text-sm text-slate-400 mb-1.5 block">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
            <input type={showPass ? 'text' : 'password'} className="input pl-10 pr-10" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3.5 text-slate-400 hover:text-white">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>
      <p className="text-center text-slate-400 text-sm mt-4">
        No account? <Link to="/register" className="text-blue-400 hover:underline">Sign up free</Link>
      </p>
    </AuthLayout>
  );
}
