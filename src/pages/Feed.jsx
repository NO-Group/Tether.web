import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import PostCard from '../components/PostCard.jsx';
import PostComposer from '../components/PostComposer.jsx';
import Avatar from '../components/Avatar.jsx';
import { fetchFeed, suggestions } from '../lib/api.js';
import { handle } from '../lib/format.js';
import { Link } from 'react-router-dom';

export default function Feed() {
  const { user, profile, supabase } = useAuth();
  const [posts, setPosts] = useState(null);
  const [sugg, setSugg] = useState([]);

  const load = useCallback(async () => {
    if (!user) return;
    const data = await fetchFeed(user.id);
    setPosts(data);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (user?.id) suggestions(user.id).then(setSugg).catch(() => {});
  }, [user?.id]);

  // live updates
  useEffect(() => {
    if (!supabase) return;
    const channel = supabase
      .channel('feed-posts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, () => load())
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [supabase, load]);

  return (
    <div className="home-grid">
      <div className="stream">
        <PostComposer onPosted={load} />
        {posts === null ? (
          <div className="center-box"><div className="spinner" /></div>
        ) : posts.length === 0 ? (
          <div className="card empty">
            <div className="big">Your stream is empty</div>
            <p>Follow people or post something — let it flow.</p>
          </div>
        ) : (
          posts.map((p) => <PostCard key={p.id} post={p} />)
        )}
      </div>

      <aside className="home-pane">
        {sugg.length > 0 && (
          <div className="card">
            <h3 style={{ marginBottom: 12 }}>Who to flow with</h3>
            {sugg.map((u) => (
              <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
                <Avatar profile={u} size={36} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <Link to={`/${handle(u.username)}`} style={{ fontWeight: 700, display: 'block' }}>
                    {u.display_name || u.username}
                  </Link>
                  <Link to={`/${handle(u.username)}`} className="muted-3">
                    @{handle(u.username)}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="card" style={{ boxShadow: 'none' }}>
          <p className="muted-3">
            <strong>@{handle(profile?.username)}</strong> · Flow lets your thoughts stream. Everything
            runs on your own Supabase + GitHub Pages.
          </p>
        </div>
      </aside>
    </div>
  );
}
