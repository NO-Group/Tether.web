import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../components/Avatar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchNotifications, markNotificationsRead } from '../lib/api.js';
import { handle, formatTime } from '../lib/format.js';

const TEXT = {
  like: 'liked your post',
  repost: 'reposted your post',
  reply: 'replied to your post',
  follow: 'started following you',
  mention: 'mentioned you',
  message: 'sent you a message',
};

export default function Notifications() {
  const { user } = useAuth();
  const [items, setItems] = useState(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const data = await fetchNotifications(user.id);
      setItems(data);
      markNotificationsRead(user.id);
    })();
  }, [user]);

  return (
    <div className="stream">
      {items === null ? (
        <div className="center-box"><div className="spinner" /></div>
      ) : items.length === 0 ? (
        <div className="card empty">
          <div className="big">Nothing new</div>
          <p>Likes, reposts, replies and follows will flow in here.</p>
        </div>
      ) : (
        items.map((n) => {
          const actorName = n.actor?.display_name || n.actor?.username || 'Someone';
          const to = n.type === 'follow' ? `/${handle(n.actor?.username)}` : n.post_id ? `/post/${n.post_id}` : '/';
          return (
            <Link key={n.id} to={to} className={`notif ${n.read ? '' : 'unread'}`}>
              <Avatar profile={n.actor} size={40} />
              <div>
                <p>
                  <strong>{actorName}</strong> <span className="muted">@{handle(n.actor?.username)}</span>
                </p>
                <p className="muted">{TEXT[n.type] || n.type}</p>
                <span className="muted-3">{formatTime(n.created_at)}</span>
              </div>
            </Link>
          );
        })
      )}
    </div>
  );
}
