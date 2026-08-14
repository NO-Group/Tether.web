import { useRef, useState } from 'react';
import Avatar from './Avatar.jsx';
import { IconImage, IconPlus } from './Icons.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { createPost, uploadFiles } from '../lib/api.js';
import { handle, formatCount } from '../lib/format.js';
import { MAX_IMAGE, MAX_VIDEO } from '../config.js';

const MAX_CHARS = 640;

export default function PostComposer({ replyTo, onPosted, placeholder = "What's flowing?" }) {
  const { user, profile } = useAuth();
  const [text, setText] = useState('');
  const [media, setMedia] = useState([]);
  const [files, setFiles] = useState([]);
  const [posting, setPosting] = useState(false);
  const [err, setErr] = useState('');
  const fileRef = useRef(null);

  const addFiles = (list) => {
    const arr = Array.from(list || []);
    const next = [...files, ...arr].slice(0, 6);
    setFiles(next);
    setMedia((m) => [...m, ...arr.map((f) => URL.createObjectURL(f))]);
  };

  const removeFile = (i) => {
    setFiles((f) => f.filter((_, idx) => idx !== i));
    setMedia((m) => m.filter((_, idx) => idx !== i));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (posting) return;
    if (!text.trim() && !files.length) return;
    setPosting(true);
    setErr('');
    try {
      for (const f of files) {
        if (f.type.startsWith('video') && f.size > MAX_VIDEO) throw new Error('Video too large (max 50MB)');
        if (f.type.startsWith('image') && f.size > MAX_IMAGE) throw new Error('Image too large (max 10MB)');
      }
      const uploaded = files.length ? await uploadFiles(files) : [];
      await createPost({ content: text, media: uploaded, parentId: replyTo?.id || null });
      setText('');
      setFiles([]);
      setMedia([]);
      onPosted?.();
    } catch (error) {
      setErr(error.message || 'Could not post');
    } finally {
      setPosting(false);
    }
  };

  return (
    <form className="composer" onSubmit={submit}>
      <Avatar profile={profile} size={44} />
      <div className="composer-body">
        {replyTo && (
          <div className="muted" style={{ fontSize: '0.85rem' }}>
            Replying to <strong>@{handle(replyTo.author?.username)}</strong>
          </div>
        )}
        <textarea
          className="composer-input"
          placeholder={placeholder}
          value={text}
          maxLength={MAX_CHARS}
          rows={2}
          onChange={(e) => setText(e.target.value)}
        />
        {media.length > 0 && (
          <div className="media-preview">
            {media.map((u, i) => (
              <div className="media-thumb" key={i}>
                {files[i]?.type.startsWith('video') ? (
                  <video src={u} muted />
                ) : (
                  <img src={u} alt="" />
                )}
                <button type="button" className="remove" onClick={() => removeFile(i)}>
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="composer-toolbar">
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
            multiple
            hidden
            onChange={(e) => addFiles(e.target.files)}
          />
          <button type="button" className="action" onClick={() => fileRef.current?.click()} title="Add media">
            <IconImage size={20} /> Media
          </button>
          {err && <span className="muted-3" style={{ color: '#e5484d' }}>{err}</span>}
          <span className={`composer-chars ${text.length > MAX_CHARS - 40 ? 'liked' : ''}`}>
            {text.length}/{MAX_CHARS}
          </span>
          <button className="btn btn-primary" type="submit" disabled={posting || (!text.trim() && !files.length)}>
            {posting ? <span className="spinner" style={{ width: 18, height: 18 }} /> : <IconPlus size={18} />}
            {replyTo ? 'Reply' : 'Post'}
          </button>
        </div>
      </div>
    </form>
  );
}
