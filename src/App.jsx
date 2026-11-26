import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { DotBackgroundDemo } from './components/dot-background-demo';
import { AuthProvider } from './context/AuthContext';
import Learn from './pages/Learn';
import Library from './pages/Library';
import Results from './pages/Results';
import Profile from './pages/Profile';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
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
          <Route path="/" element={<Navigate to="/library" replace />} />
          <Route path="/dashboard" element={<Navigate to="/library" replace />} />
          <Route path="/library" element={<Library />} />
          <Route path="/learn/:lessonId" element={<Learn />} />
          <Route path="/results" element={<Results />} />
          <Route path="/results/:attemptId" element={<Results />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
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