import { useState } from 'react';
import Avatar from '../components/Avatar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { updateProfile, uploadAvatar } from '../lib/api.js';
import { handle } from '../lib/format.js';
import { profileUrl as appProfileUrl } from '../config.js';

export default function Settings() {
  const { profile, refreshProfile } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState('');

  const shareUrl = appProfileUrl(profile?.username);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    setMsg(null);
    try {
      await updateProfile(profile.id, { display_name: displayName.trim() || null, bio: bio.trim() || null });
      await refreshProfile(profile.id);
      setMsg('Saved.');
    } catch (error) {
      setErr(error.message);
    } finally {
      setBusy(false);
    }
  };

  const onAvatar = async (file) => {
    if (!file) return;
    setBusy(true);
    setErr('');
    try {
      const url = await uploadAvatar(file);
      await updateProfile(profile.id, { avatar_url: url });
      await refreshProfile(profile.id);
      setMsg('Avatar updated.');
    } catch (error) {
      setErr(error.message);
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setMsg('Profile link copied.');
    } catch {
      setMsg('Copy your profile link: ' + shareUrl);
    }
  };

  if (!profile) return <div className="center-box"><div className="spinner" /></div>;

  return (
    <div className="stream">
      <div className="card">
        <h2 style={{ marginBottom: 16 }}>Profile settings</h2>
        {err && <div className="feedback error">{err}</div>}
        {msg && <div className="feedback success">{msg}</div>}

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <Avatar profile={profile} size={72} />
          <div>
            <div className="muted">@{handle(profile.username)}</div>
            <label className="btn btn-ghost" style={{ display: 'inline-flex', marginTop: 6, cursor: 'pointer' }}>
              Change avatar
              <input type="file" accept="image/*" hidden onChange={(e) => onAvatar(e.target.files?.[0])} />
            </label>
          </div>
        </div>

        <form onSubmit={save}>
          <div className="field">
            <label>Display name</label>
            <input className="input" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </div>
          <div className="field">
            <label>Bio</label>
            <textarea className="textarea" value={bio} onChange={(e) => setBio(e.target.value)} maxLength={300} />
          </div>
          <button className="btn btn-primary" type="submit" disabled={busy}>
            {busy ? 'Saving…' : 'Save'}
          </button>
        </form>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 10 }}>Share your profile</h3>
        <p className="muted" style={{ marginBottom: 10 }}>
          Send this link and people can find your stream:
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <input className="input" readOnly value={shareUrl} onFocus={(e) => e.target.select()} />
          <button className="btn btn-primary" onClick={copy}>Copy</button>
        </div>
      </div>
    </div>
  );
}
