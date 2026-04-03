import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, User, Loader2 } from 'lucide-react';
import { interviewApi } from '../../lib/api/interviews';
import { toast } from 'sonner';

export default function CandidateLogin() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow single character
    if (value.length > 1) {
      value = value[value.length - 1];
    }
    
    // Alphanumeric allowed
    if (!/^[a-zA-Z0-9]*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.toUpperCase();
    setOtp(newOtp);

    // Auto-advance
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!name.trim() || !email.trim()) {
        toast.error('Please enter your name and email');
        return;
      }
      setStep(2);
    } else {
      const code = otp.join('');
      if (code.length !== 6) {
        toast.error('Please enter the full 6-character OTP');
        return;
      }

      setIsLoading(true);
      try {
        const result = await interviewApi.joinInterview({
          code,
          name,
          email
        });
        
        toast.success('OTP Verified!');
        // Navigate to the secure live session room
        navigate(`/interview/${code}?sessionId=${result.sessionId}`);
      } catch (err: any) {
        toast.error(err.message || 'Invalid or expired OTP');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-white/20 relative overflow-hidden">
      {/* Background glow effects strictly using the purple palette */}
      <div className="absolute top-0 right-0 w-[800px] h-[500px] opacity-20 pointer-events-none blur-[140px]" 
           style={{ background: 'radial-gradient(ellipse at top right, #8e69d2 0%, #7359c9 50%, transparent 70%)' }} />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] opacity-[0.15] pointer-events-none blur-[120px]" 
           style={{ background: 'radial-gradient(circle at bottom left, #dc98eb 0%, transparent 60%)' }} />

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
        <div className="w-full max-w-[420px]">
          {/* Header to match Hero */}
          <div className="flex flex-col items-center text-center pt-20 pb-12 px-6">
            <div className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[#a879da] text-[10px] uppercase font-bold tracking-widest mb-8">
              Candidate Portal
            </div>
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-6 leading-[1.1] max-w-4xl">
              Your <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#e879f9] to-[#a855f7]">Profile.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl leading-relaxed font-medium">
              Enter your details to access your account.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#7359c9]/5 to-transparent pointer-events-none" />
            
            <form className="relative z-10 w-full" onSubmit={handleContinue}>
              <div className="relative w-full overflow-hidden">
                {/* Step 1: Email & Name */}
                <div className={`transition-all duration-300 ease-in-out w-full ${step === 1 ? 'opacity-100 translate-x-0 relative' : 'opacity-0 -translate-x-full absolute top-0 pointer-events-none invisible'}`}>
                  <div className="space-y-5 pb-6">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                          <User size={18} />
                        </div>
                        <input 
                          type="text" 
                          placeholder="Alex Morgan" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-[#111] border border-white/5 focus:border-[#a879da] focus:ring-1 focus:ring-[#a879da] rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-gray-600 outline-none transition-all"
                          required={step === 1}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                          <Mail size={18} />
                        </div>
                        <input 
                          type="email" 
                          placeholder="alex@example.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-[#111] border border-white/5 focus:border-[#a879da] focus:ring-1 focus:ring-[#a879da] rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-gray-600 outline-none transition-all"
                          required={step === 1}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2: OTP Verification */}
                <div className={`transition-all duration-300 ease-in-out w-full ${step === 2 ? 'opacity-100 translate-x-0 relative' : 'opacity-0 translate-x-full absolute top-0 pointer-events-none invisible'}`}>
                  <div className="space-y-5 pb-6">
                    <div className="text-center mb-6">
                      <div className="inline-block px-3 py-1 rounded-full bg-[#a879da]/10 border border-[#a879da]/20 text-[#c289e3] text-[10px] font-bold uppercase tracking-widest mb-3">Verification</div>
                      <p className="text-sm text-gray-300 leading-relaxed px-4">We've sent a 6-character code to your email. Enter it below.</p>
                    </div>

                    <div className="flex justify-between gap-2.5 sm:gap-3">
                      {otp.map((data, index) => (
                        <input
                          key={index}
                          ref={(el) => { inputRefs.current[index] = el; }}
                          type="text"
                          maxLength={1}
                          value={data}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          className="w-full aspect-square text-center text-xl sm:text-2xl font-bold bg-[#111] border border-white/10 rounded-xl focus:border-[#dc98eb] focus:ring-2 focus:ring-[#dc98eb]/20 text-white outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
                        />
                      ))}
                    </div>
                    
                    <div className="text-center mt-4">
                      <button type="button" className="text-xs text-[#a879da] hover:text-[#dc98eb] font-medium transition-colors">Resend Code</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-4 flex items-center justify-center gap-2 bg-gradient-to-r from-[#8e69d2] to-[#a879da] hover:from-[#a879da] hover:to-[#c289e3] text-white font-bold rounded-xl shadow-[0_0_24px_rgba(142,105,210,0.3)] hover:shadow-[0_0_32px_rgba(168,121,218,0.4)] transition-all transform hover:-translate-y-0.5 mt-2 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                  {isLoading && <Loader2 size={18} className="animate-spin" />}
                  {step === 1 ? 'Continue' : 'Verify & Login'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
