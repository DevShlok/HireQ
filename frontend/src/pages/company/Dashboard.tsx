import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Video, Users, Clock, Search, Filter } from 'lucide-react';
import CreateInterviewModal from '../../components/dashboard/CreateInterviewModal';
import { interviewApi } from '../../lib/api/interviews';
import { authApi } from '../../lib/api/auth';

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authApi.getToken()) {
      navigate('/company-login');
      return;
    }

    const fetchInterviews = async () => {
      try {
        const data = await interviewApi.getInterviews();
        setInterviews(data);
      } catch (error) {
        console.error('Failed to load interviews', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  const handleInterviewCreated = (newInterview: any) => {
    setInterviews([newInterview, ...interviews]);
  };

  const company = authApi.getCompany();
  const initials = company ? company.name.substring(0, 2).toUpperCase() : 'CO';
  const companyName = company ? company.name : 'Company';

  const handleLogout = () => {
    authApi.logout();
    navigate('/company-login');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-white/20">
      
      {/* Navbar */}
      <header className="px-8 py-5 flex items-center justify-between border-b border-white/10 bg-[#0a0a0a]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-0.5 text-xl font-bold tracking-tight select-none">
          <span className="text-white">hire</span>
          <span className="text-[#3e39b8] italic">Q</span>
          <span className="ml-4 pl-4 border-l border-white/20 text-sm font-medium text-gray-400">{companyName} Dashboard</span>
        </div>
        
        <div className="flex items-center gap-6">
          <button onClick={handleLogout} className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">Logout</button>
          <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center text-blue-500 font-bold text-xs">
            {initials}
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-8 flex flex-col gap-10">
        
        {/* Top Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">Interviews</h1>
            <p className="text-gray-400 text-base">Manage your active technical assessments.</p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.2)] transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            Create Interview
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><Video size={20} /></div>
              <h3 className="text-gray-400 font-medium">Active Interviews</h3>
            </div>
            <p className="text-4xl font-extrabold pb-1">{interviews.length}</p>
          </div>
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl"><Users size={20} /></div>
              <h3 className="text-gray-400 font-medium">Total Candidates</h3>
            </div>
            <p className="text-4xl font-extrabold pb-1">
              {interviews.reduce((acc, curr) => acc + (curr.candidates || 0), 0)}
            </p>
          </div>
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-500/10 text-green-500 rounded-xl"><Clock size={20} /></div>
              <h3 className="text-gray-400 font-medium">Avg. Completion</h3>
            </div>
            <p className="text-4xl font-extrabold pb-1">42m</p>
          </div>
        </div>

        {/* Interview List Section */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Assessments</h2>
            <div className="flex gap-2">
              <button className="p-2 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"><Search size={18} /></button>
              <button className="p-2 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"><Filter size={18} /></button>
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-[#111]/50 text-xs uppercase tracking-widest text-gray-500 font-semibold">
                  <th className="p-5 font-medium">Role / Title</th>
                  <th className="p-5 font-medium">Code</th>
                  <th className="p-5 font-medium">Candidates</th>
                  <th className="p-5 font-medium">Status</th>
                  <th className="p-5 font-medium">Created</th>
                  <th className="p-5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-5 text-center text-gray-500">Loading assessments...</td>
                  </tr>
                ) : interviews.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-5 text-center text-gray-500">No assessments found. Create one to get started.</td>
                  </tr>
                ) : (
                  interviews.map((interview, idx) => (
                    <tr key={interview.rawId || idx} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-5 font-bold text-base">{interview.role}</td>
                      <td className="p-5 font-mono text-gray-400"><span className="bg-white/5 px-2 py-1 rounded border border-white/10">{interview.id}</span></td>
                      <td className="p-5"><div className="flex items-center gap-2"><Users size={14} className="text-gray-500" />{interview.candidates} joined</div></td>
                      <td className="p-5">
                        <span className={`px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-full ${
                          interview.status === 'Active' ? 'bg-green-500/10 text-green-500' :
                          interview.status === 'Draft' ? 'bg-gray-500/10 text-gray-400' :
                          'bg-blue-500/10 text-blue-500'
                        }`}>
                          {interview.status}
                        </span>
                      </td>
                      <td className="p-5 text-gray-400">{new Date(interview.created).toLocaleDateString()}</td>
                      <td className="p-5 text-right">
                        <Link to={`/company/dashboard/reports/${interview.id}`} className="text-[#3e39b8] hover:text-[#5949c1] font-semibold transition-colors opacity-0 group-hover:opacity-100">View Reports</Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      <CreateInterviewModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreated={handleInterviewCreated} 
      />
    </div>
  );
}
