import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, User, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';
import { interviewApi } from '../../lib/api/interviews';
import { toast } from 'sonner';

export default function CandidateJoin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ code: '', name: '', email: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await interviewApi.joinInterview(formData);
      
      toast.success(`Joining ${result.interviewTitle}...`);
      navigate(`/interview/${formData.code}?sessionId=${result.sessionId}`);
    } catch (error: any) {
      console.error('Failed to join', error);
      toast.error(error.message || 'Invalid interview code or an error occurred.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Join Interview</h1>
          <p className="text-gray-400">Enter your access code to begin.</p>
        </div>

        <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Interview Code */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Interview Code</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <KeyRound size={18} />
                </div>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. 8JMRAQ" 
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full bg-[#111] border border-white/5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-gray-600 outline-none transition-all uppercase"
                />
              </div>
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  required
                  placeholder="Alex Morgan" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#111] border border-white/5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-gray-600 outline-none transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  required
                  placeholder="alex@example.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#111] border border-white/5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-gray-600 outline-none transition-all"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 mt-4 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Joining...' : 'Enter Waiting Room'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
