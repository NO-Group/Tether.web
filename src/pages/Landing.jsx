import { Link } from 'react-router-dom';
import Logo from '../components/Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Landing() {
  const { user } = useAuth();
  return (
    <div className="landing">
      <div className="floaty">
        <Logo size={88} />
      </div>
      <h1 className="landing-hero">Let it flow.</h1>
      <p className="landing-sub">
        Flow is a self-hosted social network on infrastructure you control. Stream your thoughts,
        follow the people who matter, thread replies, message privately, and share every kind of
        media — all under <strong>@yourname.no.flw</strong>.
      </p>
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        {user ? (
          <Link className="btn btn-primary" to="/">
            Open your stream
          </Link>
        ) : (
          <>
            <Link className="btn btn-primary" to="/signup">
              Create your handle
            </Link>
            <Link className="btn btn-ghost" to="/login">
              Sign in
            </Link>
          </>
        )}
      </div>
      <p className="muted-3" style={{ marginTop: 24 }}>
        Posts, likes, reposts, threads, views, follows, DMs &amp; full media — live on GitHub Pages
        and Supabase.
      </p>
    </div>
  );
}
