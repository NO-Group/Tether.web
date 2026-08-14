import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PostCard from '../components/PostCard.jsx';
import { IconSearch } from '../components/Icons.jsx';
import { fetchExplore, searchPosts } from '../lib/api.js';

export default function Explore() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const [posts, setPosts] = useState(null);
  const [query, setQuery] = useState(q);

  useEffect(() => {
    (async () => {
      setPosts(null);
      const data = q ? await searchPosts(q) : await fetchExplore();
      setPosts(data);
    })();
  }, [q]);

  const submit = (e) => {
    e.preventDefault();
    setParams(query ? { q: query } : {});
  };

  return (
    <div className="stream">
      <form className="topbar-search" onSubmit={submit} style={{ maxWidth: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-subtle)', border: 'var(--hairline)', borderRadius: 999, padding: '10px 16px' }}>
          <IconSearch />
          <input
            className="input"
            style={{ border: 'none', background: 'transparent', padding: 0 }}
            placeholder="Search the stream…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </form>

      {posts === null ? (
        <div className="center-box"><div className="spinner" /></div>
      ) : posts.length === 0 ? (
        <div className="card empty">
          <div className="big">{q ? 'No results' : 'Nothing flowing yet'}</div>
          <p>{q ? `Nothing matched "${q}".` : 'Be the first to post on the discover stream.'}</p>
        </div>
      ) : (
        posts.map((p) => <PostCard key={p.id} post={p} />)
      )}
    </div>
  );
}
