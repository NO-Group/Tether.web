import { useState, useEffect, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from './Avatar.jsx';
import MediaViewer from './MediaViewer.jsx';
import { IconHeart, IconRetweet, IconReply, IconEye } from './Icons.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  toggleLike,
  repost,
  isLikedByUser,
  isReposted,
  likeCount,
  repostCount,
  recordView,
} from '../lib/api.js';
import { handle, formatTime, formatCount } from '../lib/format.js';

const RepostBanner = ({ user }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-2)', fontSize: '0.85rem', fontWeight: 700, marginBottom: 8 }}>
    <IconRetweet size={16} />
    <Link to={`/${handle(user.username)}`}>{user.display_name || user.username}</Link>
    <span className="muted-3" style={{ fontWeight: 400 }}>reposted</span>
  </div>
);

function PostCardInner({ post, onReply, showThreadContext = false }) {
  const { user } = useAuth();
  const nav = useNavigate();
  const isRepost = Boolean(post.repost_of);
  const original = isRepost ? post.original : post;

  const [liked, setLiked] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [likes, setLikes] = useState(0);
  const [reposts, setReposts] = useState(0);

  // Load interaction state
  useEffect(() => {
    let active = true;
    (async () => {
      const [lk, rp, lc, rc] = await Promise.all([
        isLikedByUser(original.id, user?.id),
        isReposted(original.id, user?.id),
        likeCount(original.id),
        repostCount(original.id),
      ]);
      if (!active) return;
      setLiked(lk);
      setReposted(rp);
      setLikes(lc);
      setReposts(rc);
    })();
    return () => (active = false);
  }, [original.id, user?.id]);

  // Record a view once per post
  useEffect(() => {
    if (user?.id) recordView(original.id, user.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [original.id]);

  const openPost = (e) => {
    if (e.target.closest('a,button')) return;
    nav(`/post/${original.id}`);
  };

  const onLike = async () => {
    if (!user) return nav('/login');
    const { liked: now } = await toggleLike(original, user.id);
    setLiked(now);
    setLikes((c) => c + (now ? 1 : -1));
  };

  const onRepost = async () => {
    if (!user) return nav('/login');
    const { reposted: now } = await repost(original, user.id);
    setReposted(now);
    setReposts((c) => c + (now ? 1 : -1));
  };

  const onReplyClick = () => {
    if (!user) return nav('/login');
    onReply?.(original);
  };

  const author = original.author;
  const linkTo = `/post/${original.id}`;

  return (
    <article className={`post ${showThreadContext && isRepost ? 'is-reply' : ''}`} onClick={openPost}>
      {isRepost && author && <RepostBanner user={author} />}

      <div className="post-head">
        <Link to={`/${handle(author.username)}`} onClick={(e) => e.stopPropagation()}>
          <Avatar profile={author} size={44} />
        </Link>
        <div className="post-author">
          <div className="post-display">
            <Link to={`/${handle(author.username)}`} onClick={(e) => e.stopPropagation()}>
              {author.display_name || author.username}
            </Link>
          </div>
          <Link to={`/${handle(author.username)}`} className="post-handle" onClick={(e) => e.stopPropagation()}>
            @{handle(author.username)}
          </Link>
        </div>
        <Link to={linkTo} className="post-created" onClick={(e) => e.stopPropagation()}>
          {formatTime(original.created_at)}
        </Link>
      </div>

      <div className="post-content">{original.content}</div>
      <MediaViewer media={original.media} />

      <div className="actions">
        <button className="action" onClick={onReplyClick} title="Reply">
          <IconReply size={18} /> Reply
        </button>
        <button className={`action ${reposted ? 'reposted' : ''}`} onClick={onRepost} title="Repost">
          <IconRetweet size={18} /> {reposts > 0 && formatCount(reposts)}
        </button>
        <button className={`action ${liked ? 'liked' : ''}`} onClick={onLike} title="Like">
          <IconHeart size={18} filled={liked} /> {likes > 0 && formatCount(likes)}
        </button>
        <button className="action" onClick={onReplyClick} title="Views">
          <IconEye size={18} /> {formatCount(original.views)}
        </button>
      </div>
    </article>
  );
}

const PostCard = memo(PostCardInner);
export default PostCard;
