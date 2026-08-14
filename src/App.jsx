import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Layout from './components/Layout.jsx';
import RequireAuth from './components/RequireAuth.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Feed from './pages/Feed.jsx';
import Explore from './pages/Explore.jsx';
import Notifications from './pages/Notifications.jsx';
import Messages from './pages/Messages.jsx';
import Profile from './pages/Profile.jsx';
import PostPage from './pages/PostPage.jsx';
import Settings from './pages/Settings.jsx';
import SetupNeeded from './pages/SetupNeeded.jsx';

// GitHub Pages rewrites unknown deep links to /flow/index.html?p=<path>.
// Restore the intended route once at startup.
function RouteRestore() {
  const nav = useNavigate();
  const { search } = useLocation();
  useEffect(() => {
    const p = new URLSearchParams(search).get('p');
    if (p) {
      nav('/' + p, { replace: true });
    }
  }, [search, nav]);
  return null;
}

function Shell() {
  const { isConfigured } = useAuth();
  if (!isConfigured) {
    return (
      <Routes>
        <Route path="*" element={<SetupNeeded />} />
      </Routes>
    );
  }
  return (
    <Routes>
      <Route path="/setup" element={<SetupNeeded />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<Layout />}>
        <Route path="/" element={<RequireAuth><Feed /></RequireAuth>} />
        <Route path="/explore" element={<RequireAuth><Explore /></RequireAuth>} />
        <Route path="/notifications" element={<RequireAuth><Notifications /></RequireAuth>} />
        <Route path="/messages" element={<RequireAuth><Messages /></RequireAuth>} />
        <Route path="/messages/:id" element={<RequireAuth><Messages /></RequireAuth>} />
        <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
        <Route path="/post/:id" element={<RequireAuth><PostPage /></RequireAuth>} />
        <Route path="/:handle" element={<RequireAuth><Profile /></RequireAuth>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function Inner() {
  // Works both on GitHub Pages (/flow/...) and local dev (any base).
  const basename = window.location.pathname.startsWith('/flow') ? '/flow' : '';
  return (
    <BrowserRouter basename={basename}>
      <RouteRestore />
      <Shell />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Inner />
    </AuthProvider>
  );
}
