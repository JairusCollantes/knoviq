import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { DotBackgroundDemo } from './components/dot-background-demo';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import Library from './pages/Library';
import Results from './pages/Results';
import Profile from './pages/Profile';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <DotBackgroundDemo >
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/learn/:lessonId" element={<Learn />} />
          <Route path="/library" element={<Library />} />
          <Route path="/results" element={<Results />} />
          <Route path="/results/:attemptId" element={<Results />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <span>Knoviq — study at your own pace.</span>
      </footer>
      </DotBackgroundDemo>
      </AuthProvider>
    </BrowserRouter>
  );
}