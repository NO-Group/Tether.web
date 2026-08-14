import Logo from '../components/Logo.jsx';

export default function SetupNeeded() {
  return (
    <div className="auth-wrap">
      <div className="auth-card animate-in" style={{ textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <Logo size={40} />
          <h1 style={{ fontSize: '1.5rem' }}>Flow is almost ready</h1>
        </div>
        <p className="muted" style={{ marginBottom: 12 }}>
          This frontend builds cleanly, but it needs a Supabase backend to start flowing. Here's how:
        </p>
        <ol className="muted" style={{ paddingLeft: 20, display: 'grid', gap: 8, marginBottom: 16 }}>
          <li>Create a free project at supabase.com</li>
          <li>
            Open <strong>SQL editor</strong> → run <code>supabase/schema.sql</code>, then{' '}
            <code>supabase/realtime.sql</code>
          </li>
          <li>
            Copy <code>.env.example</code> → <code>.env</code> and paste your project URL + anon key
          </li>
          <li>Run <code>npm run dev</code> — you're live</li>
        </ol>
        <p className="muted-3">See the repo README for the full walkthrough, including GitHub Pages deployment and wrapping the app for iOS/Android.</p>
      </div>
    </div>
  );
}
