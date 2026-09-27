import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { DotBackgroundDemo } from './components/dot-background-demo';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import Library from './pages/Library';
import Results from './pages/Results';
import Profile from './pages/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <DotBackgroundDemo >
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/learn/:lessonId" element={<Learn />} />
        <Route path="/library" element={<Library />} />
        <Route path="/results" element={<Results />} />
        <Route path="/results/:attemptId" element={<Results />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      </DotBackgroundDemo>
    </BrowserRouter>
  );
}