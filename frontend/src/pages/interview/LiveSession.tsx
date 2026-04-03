import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Camera, Mic, MonitorPlay, CheckSquare, Square, Building2, Briefcase, User, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { interviewApi } from '../../lib/api/interviews';

export default function LiveSession() {
  const { code } = useParams();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  const navigate = useNavigate();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState<'loading' | 'welcome' | 'setup' | 'live'>('loading');
  const [sessionData, setSessionData] = useState<any>(null);
  
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fetch verified Session details
  useEffect(() => {
    if (!sessionId) {
      toast.error('Invalid Session');
      navigate('/candidate/join');
      return;
    }

    interviewApi.getSessionDetails(sessionId)
      .then(data => {
        setSessionData(data);
        setStep('welcome');
      })
      .catch(() => {
        toast.error('Failed to authenticate session.');
        navigate('/candidate/join');
      });
  }, [sessionId, navigate]);

  // Security Monitoring
  useEffect(() => {
    if (step !== 'live') return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        toast.error('Security Violation: Tab switching is prohibited during the interview.', {
          duration: 5000,
          style: { background: '#ef4444', color: 'white', border: 'none' }
        });
        console.warn('Security Alert: Tab switched.');
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
        toast.warning('Security Warning: You exited fullscreen mode. Please return to fullscreen.', {
          duration: 4000
        });
      } else {
        setIsFullscreen(true);
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ''; // Shows standard browser exit warning
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Cleanup media tracks on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream, step]);

  const requestMedia = async () => {
    try {
      // Force fullscreen before requesting media (UX pattern)
      try {
        await document.documentElement.requestFullscreen();
      } catch (err) {
        console.warn('Could not enter fullscreen automatically.', err);
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setStream(mediaStream);
      setStep('live');
      toast.success('Camera and Microphone connected successfully.');
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Failed to get media permissions', err);
      alert('Camera and microphone access is required for the interview.');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans">
      
      {/* Navbar/Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-white/10 bg-[#0a0a0a]">
        <div className="flex items-center gap-2 font-bold tracking-tight">
          <span className="text-white">hire</span>
          <span className="text-blue-500 italic">Q</span>
          <span className="ml-4 pl-4 border-l border-white/20 text-sm text-gray-400 font-medium">Interview Session: {code}</span>
        </div>
        
        <div className="flex items-center gap-4 text-xs font-semibold">
          {!isFullscreen && step === 'live' && (
            <button 
              onClick={() => document.documentElement.requestFullscreen()}
              className="px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
            >
              Enter Fullscreen
            </button>
          )}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            REC
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 relative flex flex-col h-full overflow-hidden">
        
        {step === 'loading' && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <Loader2 size={40} className="animate-spin text-blue-500 mb-4" />
            <p className="text-gray-400">Verifying safe room...</p>
          </div>
        )}

        {step === 'welcome' && sessionData && (
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#050505]/95 backdrop-blur-md px-4"
            >
              <div className="w-full max-w-xl bg-gradient-to-b from-[#111] to-[#0a0a0a] border border-white/10 rounded-3xl p-10 shadow-2xl text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2429af] via-[#7359c9] to-[#dc98eb]" />
                
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                  <CheckSquare size={40} />
                </div>
                
                <h2 className="text-3xl font-extrabold mb-2 text-white">OTP Verified!</h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  You have successfully authenticated into the secure waiting room. Here are your interview details:
                </p>

                <div className="bg-black/40 border border-white/5 rounded-2xl p-6 text-left mb-8 space-y-4">
                  <div className="flex items-end gap-3 pb-4 border-b border-white/5">
                    <User className="text-blue-500 pb-1" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Candidate</p>
                      <p className="text-lg font-medium text-white">{sessionData.candidateName}</p>
                    </div>
                  </div>
                  <div className="flex items-end gap-3 pb-4 border-b border-white/5">
                    <Briefcase className="text-purple-500 pb-1" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Role</p>
                      <p className="text-lg font-medium text-white">{sessionData.role}</p>
                    </div>
                  </div>
                  <div className="flex items-end gap-3">
                    <Building2 className="text-pink-500 pb-1" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Company</p>
                      <p className="text-lg font-medium text-white">{sessionData.companyName}</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setStep('setup')}
                  className="px-8 py-3.5 bg-white text-black hover:bg-gray-200 font-bold rounded-xl transition-colors flex items-center gap-2 mx-auto"
                >
                  Proceed to Setup <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {step === 'setup' && (
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#050505]/95 backdrop-blur-md"
            >
              <div className="w-full max-w-lg bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl text-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 mx-auto mb-6">
                  <MonitorPlay size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-3">Interview Terms & Setup</h2>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed text-left">
                  Before starting, please ensure you are in a quiet environment. 
                  This interview requires both <strong className="text-white">camera and microphone access</strong>. 
                  Your browser will be forced into <strong className="text-white">fullscreen mode</strong>. 
                  Leaving the interview tab or minimizing the window will trigger a security violation and be logged by the system.
                </p>

                <div 
                  className="flex items-center gap-3 mb-6 p-4 rounded-xl border border-white/5 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors text-left"
                  onClick={() => setAgreedToTerms(!agreedToTerms)}
                >
                  <div className={`flex-shrink-0 transition-colors ${agreedToTerms ? 'text-blue-500' : 'text-gray-500'}`}>
                    {agreedToTerms ? <CheckSquare size={20} /> : <Square size={20} />}
                  </div>
                  <span className="text-sm font-medium text-gray-300 select-none">
                    I agree to the continuous camera, audio, and screen tracking terms for the duration of this assessment.
                  </span>
                </div>

                <button 
                  onClick={requestMedia}
                  disabled={!agreedToTerms}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors"
                >
                  Accept & Enable Camera
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
        
        {step === 'live' && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
            {/* Left side: AI Presenter / Question Data */}
            <div className="lg:col-span-3 bg-[#111] rounded-2xl border border-white/5 flex flex-col shadow-inner relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-500 font-medium">AI Interviewer Stream Placeholder</p>
              </div>
              
              {/* Question Banner Overlay */}
              <div className="absolute bottom-6 left-6 right-6 bg-[#0a0a0a]/90 backdrop-blur border border-white/10 rounded-xl p-6 shadow-2xl">
                <div className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">Question 1 of 5</div>
                <h3 className="text-xl font-medium leading-relaxed">
                  "Can you describe a time when you had to rapidly learn a new technology stack to deliver a project on time?"
                </h3>
              </div>
            </div>

            {/* Right side: User Camera & Controls */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              {/* Camera Preview */}
              <div className="w-full aspect-video bg-[#1a1a1a] rounded-2xl border border-white/10 overflow-hidden relative shadow-lg">
                <video 
                  ref={videoRef}
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover transform scale-x-[-1]"
                />
                <div className="absolute bottom-3 left-3 flex gap-2">
                  <div className="bg-black/60 backdrop-blur-md p-2 rounded-lg text-white border border-white/10">
                    <Mic size={14} />
                  </div>
                  <div className="bg-black/60 backdrop-blur-md p-2 rounded-lg text-white border border-white/10">
                    <Camera size={14} />
                  </div>
                </div>
              </div>

              {/* Status / Monitoring panel */}
              <div className="flex-1 bg-[#111] rounded-2xl border border-white/5 p-6 flex flex-col">
                <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Environment Checks</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Audio Level</span>
                    <span className="text-green-500 font-medium">Good</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Video Quality</span>
                    <span className="text-green-500 font-medium">HD</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Connection</span>
                    <span className="text-blue-500 font-medium">Stable</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
