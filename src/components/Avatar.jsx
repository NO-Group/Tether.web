import { initials } from '../lib/format.js';

export default function Avatar({ profile, size = 44 }) {
  const name = profile?.display_name || profile?.username || '?';
  if (profile?.avatar_url) {
    return (
      <img
        className="avatar"
        src={profile.avatar_url}
        alt={name}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div className="avatar" style={{ width: size, height: size }}>
      <span className="avatar-fallback" style={{ fontSize: size * 0.42 }}>
        {initials(name)}
      </span>
    </div>
  );
}
