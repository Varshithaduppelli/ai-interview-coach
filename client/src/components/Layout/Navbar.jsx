import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Brain, LayoutDashboard, Play, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path) => location.pathname === path ? 'text-blue-400' : 'text-slate-400 hover:text-white';

  return (
    <nav className="bg-slate-800/90 backdrop-blur border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-blue-400" />
          <span className="font-bold text-white">InterviewAI</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isActive('/dashboard')}`}>
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
          <Link to="/interview" className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isActive('/interview')}`}>
            <Play className="w-4 h-4" /> Practice
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:block">{user?.name?.split(' ')[0]}</span>
          </div>
          <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-slate-700">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}
