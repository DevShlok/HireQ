import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Building2 } from 'lucide-react';
import { authApi } from '../../lib/api/auth';

export default function CompanyLogin() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'register') {
        const data = await authApi.register({ name, email, password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('company', JSON.stringify(data.company));
      } else {
        const data = await authApi.login({ email, password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('company', JSON.stringify(data.company));
      }
      navigate('/company/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-white/20 relative overflow-hidden">
      {/* Background glow effects strictly using the blue palette */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-30 pointer-events-none blur-[120px]" 
           style={{ background: 'radial-gradient(ellipse at top, #2429af 0%, #0919a6 40%, transparent 70%)' }} />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] opacity-20 pointer-events-none blur-[100px]" 
           style={{ background: 'radial-gradient(circle at bottom right, #3e39b8 0%, transparent 60%)' }} />

      {/* ── NAVBAR ── */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-[1440px]">
        <div className="flex items-center justify-between bg-[#050505]/95 backdrop-blur-md px-10 py-[18px] rounded-full border border-white/8 shadow-xl shadow-black/60">
          <img src="/logo.png" alt="hireQ.co" className="h-8 w-auto ml-1 select-none" style={{ filter: 'brightness(0) invert(1)' }} />
          
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group mr-2">
            <span className="text-sm font-bold">Return Home</span>
            <div className="p-1.5 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors border border-white/5">
              <ArrowLeft size={16} />
            </div>
          </Link>
        </div>
      </div>

      {/* Login Container */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10 w-full">
        <div className="w-full max-w-md">
          {/* Header to match Hero */}
          <div className="flex flex-col items-center text-center pt-20 pb-12 px-6">
            <div className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[#3e39b8] text-[10px] uppercase font-bold tracking-widest mb-8">
              Secured Access
            </div>
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-6 leading-[1.1] max-w-4xl">
              {mode === 'login' ? (
                <>
                  Company <br />
                  <span className="text-[#2429af]">Dashboard.</span>
                </>
              ) : (
                <>
                  Create <br />
                  <span className="text-[#2429af]">Account.</span>
                </>
              )}
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl leading-relaxed font-medium">
              {mode === 'login' ? 'Access your workspace to manage candidates.' : 'Set up your company workspace to start hiring.'}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            {/* Inner subtle glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#2429af]/5 to-transparent pointer-events-none" />
            
            <form className="relative z-10 space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg text-center animate-fade-in">
                  {error}
                </div>
              )}
              
              {mode === 'register' && (
                <div className="space-y-1.5 animate-fade-in">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Company Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                      <Building2 size={18} />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Acme Corp" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#111] border border-white/10 focus:border-[#3e39b8] focus:ring-1 focus:ring-[#3e39b8] rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-gray-600 outline-none transition-all"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Work Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email" 
                    placeholder="name@company.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 focus:border-[#3e39b8] focus:ring-1 focus:ring-[#3e39b8] rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-gray-600 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between ml-1 mb-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Password</label>
                  {mode === 'login' && (
                    <a href="#" className="text-xs text-[#3e39b8] hover:text-[#5949c1] font-medium transition-colors">Forgot?</a>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                    <Lock size={18} />
                  </div>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 focus:border-[#3e39b8] focus:ring-1 focus:ring-[#3e39b8] rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-gray-600 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 mt-4 bg-gradient-to-r from-[#2429af] to-[#3e39b8] hover:from-[#3e39b8] hover:to-[#5949c1] text-white font-bold rounded-xl shadow-[0_0_20px_rgba(36,41,175,0.4)] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : (mode === 'login' ? 'Sign In to Dashboard' : 'Create Company Workspace')}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 text-center relative z-10">
              <p className="text-sm text-gray-400">
                {mode === 'login' ? "Don't have a company account? " : "Already have an account? "}
                <button 
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="text-[#3e39b8] hover:text-[#5949c1] font-semibold transition-colors"
                >
                  {mode === 'login' ? 'Register here' : 'Sign in here'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
