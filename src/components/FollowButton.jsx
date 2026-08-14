import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { isFollowing, toggleFollow } from '../lib/api.js';

export default function FollowButton({ targetId }) {
  const { user } = useAuth();
  const nav = useNavigate();
  const [following, setFollowing] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    if (user?.id && targetId) isFollowing(user.id, targetId).then((f) => active && setFollowing(f));
    return () => (active = false);
  }, [user?.id, targetId]);

  if (!user || user.id === targetId) return null;

  const click = async () => {
    if (!user) return nav('/login');
    setBusy(true);
    try {
      const { following } = await toggleFollow(user.id, targetId);
      setFollowing(following);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button className={`btn ${following ? 'btn-ghost' : 'btn-primary'}`} onClick={click} disabled={busy}>
      {following ? 'Following' : 'Follow'}
    </button>
  );
}
