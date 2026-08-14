import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Avatar from '../components/Avatar.jsx';
import PostCard from '../components/PostCard.jsx';
import FollowButton from '../components/FollowButton.jsx';
import PostComposer from '../components/PostComposer.jsx';
import { IconChat } from '../components/Icons.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getProfile, fetchUserPosts, followersCount, followingCount, getOrCreateConversation } from '../lib/api.js';
import { handle, stripHandle, formatDate } from '../lib/format.js';

export default function Profile() {
  const { handle: h } = useParams();
  const username = stripHandle(h);
  const { user, profile: me } = useAuth();
  const nav = useNavigate();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState(null);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [loadKey, setLoadKey] = useState(0);

  useEffect(() => {
    setProfile(null);
    setPosts(null);
    (async () => {
      const p = await getProfile(username);
      setProfile(p || null);
      if (p) {
        fetchUserPosts(username).then(setPosts);
        followersCount(p.id).then(setFollowers);
        followingCount(p.id).then(setFollowing);
      }
    })();
  }, [username, loadKey]);

  if (!profile) {
    return (
      <div className="stream">
        {profile === null ? (
          <div className="center-box"><div className="spinner" /></div>
        ) : (
          <div className="card empty">
            <div className="big">@@{handle(username)} not found</div>
            <p>This handle doesn't exist — yet.</p>
          </div>
        )}
      </div>
    );
  }

  const isMe = me?.id === profile.id;
  const message = async () => {
    const convId = await getOrCreateConversation(user.id, profile.id);
    nav(`/messages/${convId}`);
  };

  return (
    <div className="stream">
      <div className="card profile-card">
        <div className="banner">{profile.banner_url && <img src={profile.banner_url} alt="" />}</div>
        <div className="profile-body">
          <div className="profile-avatar-row">
            <Avatar profile={profile} size={96} />
            {isMe ? (
              <button className="btn btn-ghost" onClick={() => nav('/settings')}>Edit profile</button>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-ghost" onClick={message} disabled={!user}>
                  <IconChat size={16} /> Message
                </button>
                <FollowButton targetId={profile.id} />
              </div>
            )}
          </div>
          <h1 className="profile-name">{profile.display_name || profile.username}</h1>
          <div className="muted">@{handle(profile.username)}</div>
          {profile.bio && <p style={{ marginTop: 10 }}>{profile.bio}</p>}
          <div className="profile-stats">
            <span className="stat"><span className="num">{following}</span> <span className="lbl">Following</span></span>
            <span className="stat"><span className="num">{followers}</span> <span className="lbl">Followers</span></span>
            <span className="stat"><span className="num">{posts?.length ?? 0}</span> <span className="lbl">Posts</span></span>
          </div>
        </div>
      </div>

      {isMe && <PostComposer onPosted={() => setLoadKey((k) => k + 1)} />}

      {posts === null ? (
        <div className="center-box"><div className="spinner" /></div>
      ) : posts.length === 0 ? (
        <div className="card empty">
          <div className="big">No posts yet</div>
          <p>Nothing flowing from this stream yet.</p>
        </div>
      ) : (
        posts.map((p) => <PostCard key={p.id} post={p} />)
      )}
    </div>
  );
}
