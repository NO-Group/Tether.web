import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { handle, validUsername } from '../lib/format.js';

export default function Signup() {
  const { supabase } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    const uname = username.trim().toLowerCase();
    if (!validUsername(uname)) {
      return setErr('Username must be 3–30 chars: lowercase letters, numbers, dot, dash or underscore.');
    }
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {},
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) {
      setBusy(false);
      return setErr(error.message);
    }
    // Claim the chosen username (a placeholder profile is auto-created by trigger).
    if (data?.user) {
      await supabase
        .from('profiles')
        .upsert({ id: data.user.id, username: uname, display_name: displayName.trim() || null })
        .select();
    }
    setBusy(false);
    nav('/');
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card animate-in">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <Logo size={40} />
          <h1 style={{ fontSize: '1.6rem' }}>Create your handle</h1>
        </div>
        {err && <div className="feedback error">{err}</div>}
        <form onSubmit={submit}>
          <div className="field">
            <label>Email</label>
            <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div className="field">
            <label>Password</label>
            <input className="input" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
          </div>
          <div className="field">
            <label>Display name</label>
            <input className="input" type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="e.g. Ada Flow" />
          </div>
          <div className="field">
            <label>Username</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input className="input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="ada" autoComplete="off" style={{ flex: 1 }} />
            </div>
            <p className="muted-3">
              Your public handle: <strong>@{handle(username || 'you')}</strong>
            </p>
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={busy}>
            {busy ? 'Creating…' : 'Sign up'}
          </button>
        </form>
        <div className="divider" />
        <p className="muted">
          Already flowing? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
