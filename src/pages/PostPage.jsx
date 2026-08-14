import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PostCard from '../components/PostCard.jsx';
import PostComposer from '../components/PostComposer.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getThread } from '../lib/api.js';

export default function PostPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [thread, setThread] = useState(null);
  const [replyTo, setReplyTo] = useState(null);

  const load = useCallback(async () => {
    const t = await getThread(id);
    setThread(t);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (!thread) {
    return (
      <div className="stream">
        <div className="center-box"><div className="spinner" /></div>
      </div>
    );
  }

  return (
    <div className="stream">
      <PostCard post={thread.root} />
      {user && <PostComposer replyTo={replyTo || thread.root} onPosted={() => { setReplyTo(null); load(); }} placeholder="Add to the flow…" />}
      <div className="thread-line" />
      {thread.replies.length === 0 ? (
        <div className="card empty">
          <div className="big">No replies yet</div>
          <p>Start the thread — reply above.</p>
        </div>
      ) : (
        thread.replies.map((r) => <PostCard key={r.id} post={r} onReply={setReplyTo} />)
      )}
    </div>
  );
}
