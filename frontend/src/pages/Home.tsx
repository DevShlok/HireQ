import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Sparkles, FileText, Zap, CheckSquare, Star, MessageSquareX, MousePointer2, UserCircle2, UploadCloud, Rocket, Check } from 'lucide-react';

const HireQClone = () => {
  const [activeView, setActiveView] = useState<'company' | 'candidate'>('company');

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-white/20">

      {/* ── NAVBAR ── */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-[1440px]">
        <div className="flex items-center justify-between bg-[#050505]/95 backdrop-blur-md px-10 py-[18px] rounded-full border border-white/8 shadow-xl shadow-black/60">

          {/* Logo */}
          <img src="/logo.png" alt="hireQ.co" className="h-8 w-auto ml-1 select-none" style={{ filter: 'brightness(0) invert(1)' }} />

          {/* Center toggle */}
          <div className="flex bg-white/5 rounded-full p-0.5 border border-white/8">
            <button
              onClick={() => setActiveView('company')}
              className={`px-4 py-1.5 rounded-full text-base font-medium transition-all ${activeView === 'company' ? 'bg-[#222] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
            >
              For Companies
            </button>
            <button
              onClick={() => setActiveView('candidate')}
              className={`px-4 py-1.5 rounded-full text-base font-medium transition-all ${activeView === 'candidate' ? 'bg-[#222] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
            >
              For Candidates
            </button>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 mr-1">
            <button className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-300 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </button>
            <button className="px-5 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-gray-100 transition-colors">
              Start Hiring
            </button>
          </div>

        </div>
      </div>


      <div className="animate-fade-in">
        {activeView === 'company' ? <CompanyView /> : <CandidateView />}
      </div>
    </div>
  );
};

/* =========================================
   COMPANY VIEW
   ========================================= */
const CompanyView = () => {
  return (
    <div className="w-full flex flex-col items-center animate-fade-in">

      {/* ── HERO ── */}
      <div className="w-full flex flex-col items-center text-center pt-28 pb-24 px-6">
        <div className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-blue-400 text-[10px] uppercase font-bold tracking-widest mb-8">
          Automate Hiring
        </div>
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-6 leading-[1.1] max-w-4xl">
          Hiring, finally <br />
          <span className="text-[#4D7EE8]">organized.</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl leading-relaxed font-medium">
          Stop digging through emails. We organize every application into one simple list, so you can find the right person fast.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link to="/company-login" className="px-8 py-3.5 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition-colors text-base shadow-lg flex items-center justify-center">
            Company Login
          </Link>
          <button className="px-8 py-3.5 bg-transparent border border-gray-700 text-gray-300 font-bold rounded-full hover:bg-white/5 transition-colors text-base">
            See How It Works
          </button>
        </div>
      </div>

      {/* Thin separator */}
      <div className="w-full max-w-[1400px] border-t border-white/5 mb-24" />

      {/* ── THE PROBLEM ── */}
      <div className="w-full max-w-[1400px] grid grid-cols-1 md:grid-cols-2 gap-20 items-center px-8 mb-32">
        <div>
          <div className="text-[#ef4444] text-xs font-bold tracking-widest uppercase mb-4">The Problem</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
            Your inbox is <br />
            <span className="text-gray-600">overwhelming.</span>
          </h2>
          <div className="space-y-5 text-gray-400 leading-relaxed mb-8 text-base md:text-lg">
            <p>You have hundreds of unread emails. Resumes are everywhere. It's impossible to keep track of who is good and who isn't.</p>
            <p>When you use email to hire, great candidates get lost in the pile.</p>
          </div>
          <div className="bg-[#111] border border-gray-800 rounded-2xl p-4 flex items-start gap-3">
            <div className="bg-red-500/10 p-2 rounded-lg text-red-500 shrink-0 mt-0.5">
              <MessageSquareX size={16} />
            </div>
            <div>
              <h4 className="text-red-400 text-base font-semibold mb-1">It's messy</h4>
              <p className="text-gray-500 text-sm leading-relaxed">You spent hours searching for attachments that aren't even the right people.</p>
            </div>
          </div>
        </div>

        {/* Mock inbox graphic */}
        <div className="relative w-full h-64 md:h-[340px] bg-[#050505] rounded-2xl border border-white/5 overflow-hidden flex flex-col p-4 gap-3">
          {[85, 65, 75, 45, 60, 50].map((w, i) => (
            <div key={i} className="flex items-center justify-between p-3.5 bg-white/[0.02] border border-white/[0.03] rounded-xl w-full shrink-0">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-8 h-8 rounded-full bg-white/[0.05] shrink-0" />
                <div className="flex-1 space-y-2.5 max-w-[70%]">
                  <div className="h-1.5 bg-white/[0.06] rounded-full" style={{ width: `${w}%` }} />
                  <div className="h-1.5 bg-white/[0.03] rounded-full w-1/2" />
                </div>
              </div>
              <div className="text-gray-500/80 text-[11px] font-medium tracking-wide">Unread</div>
            </div>
          ))}

          {/* Centre badge — 543 unread */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="bg-[#050505]/80 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full shadow-2xl">
              <span className="font-mono text-xs text-gray-300 tracking-wider">543 Unread Applications</span>
            </div>
          </div>

          {/* Bottom fade */}
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none z-0" />
        </div>
      </div>

      {/* ── THE SOLUTION ── */}
      <div className="w-full flex flex-col items-center" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(59,130,246,0.06) 0%, transparent 70%)' }}>
      <div className="w-full max-w-[1400px] flex flex-col items-center text-center px-8 mb-32">
        <div className="text-[#4D7EE8] text-xs font-bold tracking-widest uppercase mb-3">The Solution</div>
        <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">We organize it for you.</h2>
        <p className="text-gray-400 mb-14 max-w-xl text-base md:text-lg">HireQ connects to your email and turns that pile of resumes into a neat, prioritized list.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full text-left">
          <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-7 hover:border-gray-700 transition-colors">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-5">
              <Mail size={20} />
            </div>
            <h3 className="text-xl font-bold mb-1">Connect your Inbox</h3>
            <div className="text-gray-700 text-xs font-bold tracking-widest uppercase mb-3">Step 1</div>
            <p className="text-gray-400 text-base leading-relaxed mb-5">
              Just link your Gmail or Outlook. We will find every application you've received in the last 6 months and organize them.
            </p>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2 text-base text-gray-300"><Check size={13} className="text-blue-500 shrink-0" /> No new passwords to remember</li>
              <li className="flex items-center gap-2 text-base text-gray-300"><Check size={13} className="text-blue-500 shrink-0" /> Finds candidates you missed</li>
            </ul>
          </div>

          <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-7 hover:border-gray-700 transition-colors">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-400 mb-5">
              <Star size={20} />
            </div>
            <h3 className="text-xl font-bold mb-1">Or use a dedicated email</h3>
            <div className="text-gray-700 text-xs font-bold tracking-widest uppercase mb-3">Step 2</div>
            <p className="text-gray-400 text-base leading-relaxed mb-5">
              We give you a custom email like <span className="text-white">apply@hireq.co</span>. Put this on LinkedIn. When people reply, they go straight to your dashboard.
            </p>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2 text-base text-gray-300"><Check size={13} className="text-blue-500 shrink-0" /> Keeps your personal inbox clean</li>
              <li className="flex items-center gap-2 text-base text-gray-300"><Check size={13} className="text-blue-500 shrink-0" /> Everything in one place</li>
            </ul>
          </div>
        </div>
      </div> {/* end Solution inner */}
      </div> {/* end Solution glow wrapper */}

      {/* ── THE PROCESS ── */}
      <div className="w-full flex flex-col items-center" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(59,130,246,0.06) 0%, transparent 70%)' }}>
      <div className="w-full max-w-[1400px] flex flex-col items-center text-center px-8 mb-32">
        <div className="text-[#4D7EE8] text-xs font-bold tracking-widest uppercase mb-3">The Process</div>
        <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">How we process talent.</h2>
        <p className="text-gray-400 mb-16 max-w-lg text-base md:text-lg">Turning chaotic documents into structured data, instantly.</p>

        <div className="flex flex-col md:flex-row items-center gap-6 w-full relative">
          <div className="hidden md:block absolute top-[38%] left-[16%] right-[16%] h-px bg-gray-800 z-0" />

          {/* Step 1 */}
          <div className="flex flex-col items-center z-10 w-full md:w-1/3">
            <span className="bg-gray-800 text-gray-400 text-xs uppercase font-bold px-3 py-1 rounded-full mb-4">Step 1</span>
            <div className="w-52 h-28 bg-[#111] border border-gray-800 rounded-2xl flex flex-col items-center justify-center gap-1.5 mb-5">
              <FileText size={26} className="text-gray-500" />
              <span className="text-xs tracking-widest font-semibold text-gray-600 uppercase">PDF / DOCX</span>
            </div>
            <h4 className="text-lg font-bold mb-1">1. Read</h4>
            <p className="text-sm text-gray-500">We scan the raw file using OCR.</p>
          </div>

          {/* Step 2 — highlighted */}
          <div className="flex flex-col items-center z-10 w-full md:w-1/3">
            <span className="bg-blue-500/20 text-blue-400 text-xs uppercase font-bold px-3 py-1 rounded-full mb-4 ring-1 ring-blue-500/40">Processing</span>
            <div className="w-52 h-28 bg-[#08101e] border border-blue-500/50 rounded-2xl flex flex-col items-center justify-center gap-1.5 mb-5 shadow-[0_0_28px_rgba(59,130,246,0.15)] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent" />
              <Zap size={26} className="text-blue-400 z-10" />
              <span className="text-xs tracking-widest font-semibold text-blue-500/60 uppercase z-10">Vector Data...</span>
            </div>
            <h4 className="text-lg font-bold mb-1">2. Structure</h4>
            <p className="text-sm text-gray-500">We extract skills and patterns.</p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center z-10 w-full md:w-1/3">
            <span className="bg-green-500/10 text-green-500 text-xs uppercase font-bold px-3 py-1 rounded-full mb-4 ring-1 ring-green-500/20">Ready</span>
            <div className="w-52 h-28 bg-[#111] border border-gray-800 rounded-2xl flex flex-col items-center justify-center gap-1.5 mb-5">
              <CheckSquare size={26} className="text-green-500" />
              <span className="text-xs tracking-widest font-semibold text-gray-600 uppercase">Match Resume / Job</span>
            </div>
            <h4 className="text-lg font-bold mb-1">3. Match</h4>
            <p className="text-sm text-gray-500">We rank the candidate for you.</p>
          </div>
        </div>
      </div> {/* end Process inner */}
      </div> {/* end Process glow wrapper */}

      {/* ── FOOTER CTA ── */}
      <div className="w-full flex flex-col items-center text-center pb-28 px-6">
        <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">Stop drowning in email.</h2>
        <p className="text-gray-400 mb-10 text-base md:text-lg">Get your hiring simplified today. No credit card required.</p>
        <button className="px-10 py-4 bg-[#4169E1] text-white font-bold rounded-full hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 text-base">
          Start for Free
        </button>
      </div>
    </div>
  );
};

/* =========================================
   CANDIDATE VIEW
   ========================================= */
const CandidateView = () => {
  return (
    <div className="w-full flex flex-col items-center animate-fade-in">

      {/* ── HERO ── */}
      <div className="w-full flex flex-col items-center text-center pt-28 pb-24 px-6">
        <div className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-purple-400 text-[10px] uppercase font-bold tracking-widest mb-8">
          For Job Seekers
        </div>
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-6 leading-[1.1] max-w-4xl">
          Stop re-typing <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#e879f9] to-[#a855f7]">your resume.</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl leading-relaxed font-medium">
          Create one profile on HireQ. Apply to thousands of companies with a single click. No more filling out the same forms over and over.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link to="/candidate-login" className="px-8 py-3.5 bg-[#a855f7] text-white font-bold rounded-full hover:bg-[#9333ea] transition-colors text-base shadow-lg shadow-purple-500/25 flex items-center justify-center">
            Candidate Login
          </Link>
          <button className="px-8 py-3.5 bg-transparent border border-gray-700 text-gray-300 font-bold rounded-full hover:bg-white/5 transition-colors text-base">
            Explore Jobs
          </button>
        </div>
      </div>

      {/* Thin separator */}
      <div className="w-full max-w-[1400px] border-t border-white/5 mb-24" />

      {/* ── THE PROBLEM ── */}
      <div className="w-full max-w-[1400px] grid grid-cols-1 md:grid-cols-2 gap-20 items-center px-8 mb-32">

        {/* Mock graphic */}
        <div className="order-2 md:order-1 relative w-full h-56 md:h-[280px] bg-[#0d0d0d] rounded-2xl border border-gray-800 overflow-hidden flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 p-6 bg-[#111] border border-gray-800 rounded-xl">
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 text-amber-400">
              <FileText size={24} />
            </div>
            <div className="w-20 h-1.5 bg-white/10 rounded-full" />
            <div className="w-14 h-1.5 bg-white/5 rounded-full" />
            <div className="text-[9px] font-bold text-red-500 tracking-widest uppercase mt-2">Error: Upload Failed</div>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <div className="text-[#a855f7] text-xs font-bold tracking-widest uppercase mb-4">The Problem</div>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Applying is <br />
            <span className="text-gray-600">broken.</span>
          </h2>
          <div className="space-y-5 text-gray-400 leading-relaxed mb-8 text-base md:text-lg">
            <p>You upload your resume, and then you have to type it all out again. It's frustrating and tedious.</p>
            <p>And after all that work, you don't even know if a human will ever see it.</p>
          </div>
          <div className="bg-[#111] border border-purple-900/30 rounded-2xl p-4 flex items-start gap-3">
            <div className="bg-purple-500/10 p-2 rounded-lg text-purple-400 shrink-0 mt-0.5">
              <Star size={16} />
            </div>
            <div>
              <h4 className="text-purple-400 text-base font-semibold mb-1">It takes too long</h4>
              <p className="text-gray-500 text-sm leading-relaxed">The average application takes 10 minutes. We cut that down to seconds.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── THE SOLUTION ── */}
      <div className="w-full flex flex-col items-center" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(168,85,247,0.07) 0%, transparent 70%)' }}>
      <div className="w-full max-w-[1400px] flex flex-col items-center text-center px-8 mb-32">
        <div className="text-[#a855f7] text-xs font-bold tracking-widest uppercase mb-3">The Solution</div>
        <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">One profile. Apply everywhere</h2>
        <p className="text-gray-400 mb-14 max-w-xl text-base md:text-lg">We read your resume for you, so you only have to upload it once.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full text-left">
          <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-7 hover:border-gray-700 transition-colors">
            <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-[#a855f7] mb-5">
              <UserCircle2 size={20} />
            </div>
            <h3 className="text-xl font-bold mb-1">Upload it once</h3>
            <p className="text-gray-400 text-base leading-relaxed mb-5">
              Upload your existing resume (PDF or Word). We automatically fill out your profile for you.
            </p>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2 text-base text-gray-300"><Check size={13} className="text-[#a855f7] shrink-0" /> No typing required</li>
              <li className="flex items-center gap-2 text-base text-gray-300"><Check size={13} className="text-[#a855f7] shrink-0" /> Preserves formatting and context</li>
            </ul>
          </div>

          <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-7 hover:border-gray-700 transition-colors">
            <div className="w-10 h-10 bg-pink-500/10 rounded-xl flex items-center justify-center text-pink-400 mb-5">
              <MousePointer2 size={20} />
            </div>
            <h3 className="text-xl font-bold mb-1">Click to apply</h3>
            <p className="text-gray-400 text-base leading-relaxed mb-5">
              When you see a job you like, just click 'Apply'. We send your profile instantly. No cover letters, no forms.
            </p>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2 text-base text-gray-300"><Check size={13} className="text-[#a855f7] shrink-0" /> Apply in seconds</li>
              <li className="flex items-center gap-2 text-base text-gray-300"><Check size={13} className="text-[#a855f7] shrink-0" /> Track your status</li>
            </ul>
          </div>
        </div>
      </div> {/* end Solution inner */}
      </div> {/* end Solution glow wrapper */}

      {/* ── THE PROCESS ── */}
      <div className="w-full flex flex-col items-center" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(168,85,247,0.07) 0%, transparent 70%)' }}>
      <div className="w-full max-w-[1400px] flex flex-col items-center text-center px-8 mb-32">
        <div className="text-[#a855f7] text-xs font-bold tracking-widest uppercase mb-3">The Fast Track</div>
        <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">How you get hired.</h2>
        <p className="text-gray-400 mb-16 max-w-lg text-base md:text-lg">Skip the forms. We do the work for you.</p>

        <div className="flex flex-col md:flex-row items-center gap-6 w-full relative">
          <div className="hidden md:block absolute top-[38%] left-[16%] right-[16%] h-px bg-purple-900/30 z-0" />

          {/* Step 1 */}
          <div className="flex flex-col items-center z-10 w-full md:w-1/3">
            <span className="bg-gray-800 text-gray-400 text-xs uppercase font-bold px-3 py-1 rounded-full mb-4 ring-1 ring-gray-700">Step 1</span>
            <div className="w-52 h-28 bg-[#111] border border-gray-800 rounded-2xl flex flex-col items-center justify-center gap-1.5 mb-5">
              <UploadCloud size={26} className="text-blue-400" />
              <span className="text-xs tracking-widest font-semibold text-gray-600 uppercase">Upload Resume</span>
            </div>
            <h4 className="text-lg font-bold mb-1">1. Upload</h4>
            <p className="text-sm text-gray-500">Drop your existing PDF here.</p>
          </div>

          {/* Step 2 — highlighted */}
          <div className="flex flex-col items-center z-10 w-full md:w-1/3">
            <span className="bg-purple-500/20 text-purple-400 text-xs uppercase font-bold px-3 py-1 rounded-full mb-4 ring-1 ring-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.3)]">Extracting</span>
            <div className="w-52 h-28 bg-[#110a1c] border border-purple-500/50 rounded-2xl flex flex-col items-center justify-center gap-1.5 mb-5 shadow-[0_0_28px_rgba(168,85,247,0.15)] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent" />
              <Sparkles size={26} className="text-yellow-400 z-10" />
              <span className="text-xs tracking-widest font-semibold text-purple-400/60 uppercase z-10">Formatting ...</span>
            </div>
            <h4 className="text-lg font-bold mb-1">2. Extract</h4>
            <p className="text-sm text-gray-500">We build your profile instantly.</p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center z-10 w-full md:w-1/3">
            <span className="bg-pink-500/10 text-pink-500 text-xs uppercase font-bold px-3 py-1 rounded-full mb-4 ring-1 ring-pink-500/20">Hired</span>
            <div className="w-52 h-28 bg-[#111] border border-gray-800 rounded-2xl flex flex-col items-center justify-center gap-1.5 mb-5">
              <Rocket size={26} className="text-pink-500" />
              <span className="text-xs tracking-widest font-semibold text-gray-600 uppercase">Ready To Apply</span>
            </div>
            <h4 className="text-lg font-bold mb-1">3. Hired</h4>
            <p className="text-sm text-gray-500">One click apply to any job.</p>
          </div>
        </div>
      </div> {/* end Process inner */}
      </div> {/* end Process glow wrapper */}

      {/* ── FOOTER CTA ── */}
      <div className="w-full flex flex-col items-center text-center pb-28 px-6">
        <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">Ready to get hired?</h2>
        <p className="text-gray-400 mb-10 text-base md:text-lg">Create your profile in 2 minutes and start applying.</p>
        <button className="px-10 py-4 bg-[#a855f7] text-white font-bold rounded-full hover:bg-[#9333ea] transition-colors shadow-lg shadow-purple-500/20 text-base">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default HireQClone;
