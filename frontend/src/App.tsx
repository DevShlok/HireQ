import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Home from './pages/Home';
import CompanyLogin from './pages/auth/CompanyLogin';
import CandidateLogin from './pages/auth/CandidateLogin';
import Dashboard from './pages/company/Dashboard';
import CandidateJoin from './pages/candidate/Join';
import LiveSession from './pages/interview/LiveSession';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/company-login" element={<CompanyLogin />} />
        <Route path="/candidate-login" element={<CandidateLogin />} />
        
        {/* Company Routes */}
        <Route path="/company/dashboard" element={<Dashboard />} />
        
        {/* Candidate Routes */}
        <Route path="/candidate/join" element={<CandidateJoin />} />
        <Route path="/interview/:code" element={<LiveSession />} />
      </Routes>
      <Toaster theme="dark" position="top-center" richColors />
    </Router>
  );
}

export default App;
