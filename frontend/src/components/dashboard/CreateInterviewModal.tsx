import { useState } from 'react';
import { X, Briefcase, FileText, Clock, Code2, MessageSquare, KeyRound, Copy, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { interviewApi } from '../../lib/api/interviews';

interface CreateInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (interview: any) => void;
}

export default function CreateInterviewModal({ isOpen, onClose, onCreated }: CreateInterviewModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '60',
    stack: '',
    instructions: ''
  });
  
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    setIsSubmitting(true);
    try {
      // Call live backend to save mapping and generate actual OTP code
      const newInterview = await interviewApi.createInterview(formData);
      
      setGeneratedOtp(newInterview.id); // 'id' contains the 6 char OTP code based on our API map
      setStep(2); // Move to success step
      
      // Update parent UI state
      onCreated(newInterview);
    } catch (err) {
      console.error('Failed to create interview', err);
      // In production, trigger a toast here
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedOtp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setStep(1);
    setFormData({ title: '', description: '', duration: '60', stack: '', instructions: '' });
    setGeneratedOtp('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#050505]/80 backdrop-blur-sm"
            onClick={step === 1 ? onClose : handleClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#111]/50">
              <h2 className="text-xl font-bold">
                {step === 1 ? 'Create New Assessment' : 'Interview Created'}
              </h2>
              <button 
                onClick={step === 1 ? onClose : handleClose}
                className="p-2 -mr-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {step === 1 ? (
                <div className="space-y-6">
                  {/* Job Title */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Job Title</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500"><Briefcase size={18} /></div>
                      <input type="text" placeholder="e.g. Senior React Developer" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#111] border border-white/10 focus:border-[#3e39b8] focus:ring-1 focus:ring-[#3e39b8] rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 outline-none transition-all" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Expected Duration */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Duration (Min)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500"><Clock size={18} /></div>
                        <select value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full bg-[#111] border border-white/10 focus:border-[#3e39b8] focus:ring-1 focus:ring-[#3e39b8] rounded-xl py-3 pl-11 pr-4 text-white outline-none transition-all appearance-none cursor-pointer">
                          <option value="30">30 Minutes</option>
                          <option value="45">45 Minutes</option>
                          <option value="60">60 Minutes</option>
                          <option value="90">90 Minutes</option>
                        </select>
                      </div>
                    </div>

                    {/* Tech Stack */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Tech Stack</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500"><Code2 size={18} /></div>
                        <input type="text" placeholder="React, Node.js, TS..." value={formData.stack} onChange={e => setFormData({...formData, stack: e.target.value})} className="w-full bg-[#111] border border-white/10 focus:border-[#3e39b8] focus:ring-1 focus:ring-[#3e39b8] rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 outline-none transition-all" />
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Job Context / Description</label>
                    <div className="relative">
                      <div className="absolute top-3.5 left-0 pl-4 pointer-events-none text-gray-500"><FileText size={18} /></div>
                      <textarea placeholder="Paste requirements here to give the AI context..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="w-full bg-[#111] border border-white/10 focus:border-[#3e39b8] focus:ring-1 focus:ring-[#3e39b8] rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 outline-none transition-all resize-none" />
                    </div>
                  </div>

                  {/* Candidate Instructions */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Candidate Instructions (Optional)</label>
                    <div className="relative">
                      <div className="absolute top-3.5 left-0 pl-4 pointer-events-none text-gray-500"><MessageSquare size={18} /></div>
                      <textarea placeholder="e.g. 'Please make sure you have a quiet background.'" value={formData.instructions} onChange={e => setFormData({...formData, instructions: e.target.value})} rows={2} className="w-full bg-[#111] border border-white/10 focus:border-[#3e39b8] focus:ring-1 focus:ring-[#3e39b8] rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 outline-none transition-all resize-none" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 flex flex-col items-center text-center space-y-6 animate-fade-in relative z-10">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#2429af]/10 to-transparent pointer-events-none -z-10 rounded-2xl" />
                  
                  <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 text-green-500 rounded-full flex items-center justify-center">
                    <Check size={32} />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Assessment Ready</h3>
                    <p className="text-gray-400">Share this unique OTP code with your candidates.<br/> They do not need an account to join.</p>
                  </div>

                  <div className="bg-[#111] border border-white/10 p-6 rounded-2xl w-full max-w-sm mt-4 relative group hover:border-[#3e39b8]/50 transition-colors">
                    <div className="flex items-center justify-center gap-4">
                      <KeyRound className="text-[#3e39b8]" size={24} />
                      <span className="text-5xl font-mono font-black tracking-widest text-white">{generatedOtp}</span>
                    </div>
                    
                    <button 
                      onClick={copyToClipboard}
                      className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#2429af] hover:bg-[#3e39b8] text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full flex items-center gap-1.5 shadow-[0_4px_14px_rgba(36,41,175,0.4)] transition-all"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      {copied ? 'Copied!' : 'Copy Code'}
                    </button>
                  </div>
                  
                  <div className="w-full max-w-sm text-sm text-gray-500 pt-6">
                    Direct candidates to <span className="text-white font-medium">hireq.co/join</span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {step === 1 && (
              <div className="p-6 border-t border-white/10 bg-[#111]/50 flex justify-end gap-3">
                <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
                <button 
                  onClick={handleCreate} 
                  disabled={!formData.title || isSubmitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#2429af] to-[#3e39b8] hover:from-[#3e39b8] hover:to-[#5949c1] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg transition-all flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <><Loader2 size={16} className="animate-spin" /> Generating...</>
                  ) : (
                    'Generate Interview OTP'
                  )}
                </button>
              </div>
            )}
            
            {step === 2 && (
              <div className="p-6 border-t border-white/10 bg-[#111]/50 flex justify-center">
                <button onClick={handleClose} className="px-8 py-3 bg-[#111] border border-white/10 hover:bg-white/5 text-white font-bold rounded-xl transition-colors">
                  Done
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
