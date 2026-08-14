import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Avatar from '../components/Avatar.jsx';
import MediaViewer from '../components/MediaViewer.jsx';
import { IconImage, IconSend } from '../components/Icons.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { listConversations, conversationWith, sendMessage } from '../lib/api.js';
import { handle, formatTime } from '../lib/format.js';

export default function Messages() {
  const { id: convId } = useParams();
  const { user, supabase } = useAuth();
  const [convs, setConvs] = useState(null);
  const [conv, setConv] = useState(null); // { other, messages }
  const [text, setText] = useState('');
  const [files, setFiles] = useState([]);
  const scrollRef = useRef(null);

  const loadConvs = async () => {
    const c = await listConversations(user.id);
    setConvs(c);
    return c;
  };

  useEffect(() => {
    if (user) loadConvs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (!convId) return setConv(null);
    conversationWith(user.id, convId).then(setConv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [convId]);

  // realtime messages
  useEffect(() => {
    if (!supabase || !convId) return;
    const ch = supabase
      .channel(`msgs-${convId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${convId}` }, () => {
        conversationWith(user.id, convId).then(setConv);
        loadConvs();
      })
      .subscribe();
    return () => supabase.removeChannel(ch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, convId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 999999 });
  }, [conv?.messages?.length]);

  const send = async (e) => {
    e.preventDefault();
    if ((!text.trim() && !files.length) || !convId) return;
    const { media } = await sendMessage(convId, user.id, { content: text });
    setText('');
    setFiles([]);
    loadConvs();
    conversationWith(user.id, convId).then(setConv);
  };

  return (
    <div className="messages-layout">
      <div className="conv-list">
        <div style={{ padding: 16, fontWeight: 700, borderBottom: 'var(--hairline)' }}>Conversations</div>
        {convs === null ? (
          <div className="center-box" style={{ minHeight: 200 }}><div className="spinner" /></div>
        ) : convs.length === 0 ? (
          <div className="empty" style={{ padding: 24 }}>No conversations yet.</div>
        ) : (
          convs.map((c) => (
            <Link key={c.id} to={`/messages/${c.id}`} className={`conv-item ${c.id === convId ? 'active' : ''}`}>
              <Avatar profile={c.other} size={40} />
              <div>
                <strong>{c.other?.display_name || c.other?.username || 'User'}</strong>
                <div className="muted-3">@{handle(c.other?.username)}</div>
              </div>
            </Link>
          ))
        )}
      </div>

      {!convId ? (
        <div className="card empty" style={{ display: 'grid', placeItems: 'center' }}>
          <div className="big">Pick a conversation</div>
          <p>Messages flow here.</p>
        </div>
      ) : !conv ? (
        <div className="center-box"><div className="spinner" /></div>
      ) : (
        <div className="chat">
          <div style={{ padding: 14, borderBottom: 'var(--hairline)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar profile={conv.other} size={34} />
            <strong>{conv.other?.display_name || conv.other?.username}</strong>
          </div>
          <div className="chat-scroll" ref={scrollRef}>
            {conv.messages.map((m) => (
              <div key={m.id} className={`bubble ${m.sender_id === user.id ? 'mine' : 'theirs'}`}>
                {m.content && <div>{m.content}</div>}
                <MediaViewer media={m.media} />
                <div style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: 4 }}>{formatTime(m.created_at)}</div>
              </div>
            ))}
          </div>
          <form className="chat-input" onSubmit={send}>
            <input
              type="file"
              accept="image/*,video/*,audio/*,.pdf,.txt,.doc,.docx"
              multiple
              hidden
              id="dm-files"
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
            />
            <label htmlFor="dm-files" className="action" title="Attach media"><IconImage size={18} /></label>
            <input
              className="input"
              style={{ flex: 1 }}
              placeholder="Message…"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button className="btn btn-primary" type="submit" disabled={!text.trim() && !files.length}>
              <IconSend size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
