import { supabase } from '../supabaseClient.js';

// Embed helper: post author
const AUTHOR = 'author:profiles(id, username, display_name, avatar_url)';

// ---------------------------------------------------------------------------
// PROFILES
// ---------------------------------------------------------------------------
export async function getProfile(username) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getMyProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateProfile(id, fields) {
  const { error } = await supabase.from('profiles').update(fields).eq('id', id);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// POSTS
// ---------------------------------------------------------------------------
const POST_SELECT = `*, ${AUTHOR}`;

export async function createPost({ content = '', media = [], parentId = null, repostOf = null }) {
  const { data: user } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('posts')
    .insert({
      author_id: user.user.id,
      content: content.trim() || null,
      media,
      parent_id: parentId,
      repost_of: repostOf,
    })
    .select(POST_SELECT)
    .single();
  if (error) throw error;
  return data;
}

export async function getPost(id) {
  const { data, error } = await supabase.from('posts').select(POST_SELECT).eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}

// Root post + its direct replies for a thread
export async function getThread(rootId) {
  const { data: root, error: rootErr } = await supabase
    .from('posts')
    .select(POST_SELECT)
    .eq('id', rootId)
    .single();
  if (rootErr) throw rootErr;
  const { data: replies, error: repErr } = await supabase
    .from('posts')
    .select(POST_SELECT)
    .eq('parent_id', rootId)
    .order('created_at', { ascending: true });
  if (repErr) throw repErr;
  return { root, replies: replies || [] };
}

// Home timeline: original posts from people I follow + me, then separate reposts
export async function fetchFeed(userId) {
  const following = await getFollowingIds(userId);
  const ids = [userId, ...following];

  const [postsRes, repostsRes] = await Promise.all([
    supabase
      .from('posts')
      .select(POST_SELECT)
      .in('author_id', ids)
      .is('repost_of', null)
      .order('created_at', { ascending: false })
      .limit(60),
    supabase
      .from('posts')
      .select(
        `*,
         ${AUTHOR},
         original:posts!posts_repost_of_fkey(*, ${AUTHOR})`
      )
      .in('author_id', ids)
      .not('repost_of', 'is', null)
      .order('created_at', { ascending: false })
      .limit(60),
  ]);

  if (postsRes.error) throw postsRes.error;
  if (repostsRes.error) throw repostsRes.error;

  // merge and sort by created_at desc
  const all = [...(postsRes.data || []), ...(repostsRes.data || [])];
  all.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return all;
}

export async function fetchUserPosts(username) {
  const { data, error } = await supabase
    .from('posts')
    .select(POST_SELECT)
    .eq('profiles.username', username)
    .is('repost_of', null)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return data || [];
}

// Explore / discover — recent public posts
export async function fetchExplore() {
  const { data, error } = await supabase
    .from('posts')
    .select(POST_SELECT)
    .is('repost_of', null)
    .order('created_at', { ascending: false })
    .limit(60);
  if (error) throw error;
  return data || [];
}

export async function searchPosts(q) {
  const { data, error } = await supabase
    .from('posts')
    .select(POST_SELECT)
    .ilike('content', `%${q}%`)
    .order('created_at', { ascending: false })
    .limit(40);
  if (error) throw error;
  return data || [];
}

export async function deletePost(id) {
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// LIKES
// ---------------------------------------------------------------------------
export async function isLikedByUser(postId, userId) {
  if (!userId) return false;
  const { data } = await supabase.from('likes').select('id').eq('post_id', postId).eq('user_id', userId).maybeSingle();
  return Boolean(data);
}

export async function likeCount(postId) {
  const { count } = await supabase
    .from('likes')
    .select('id', { count: 'exact', head: true })
    .eq('post_id', postId);
  return count || 0;
}

export async function toggleLike(post, userId) {
  const existing = await isLikedByUser(post.id, userId);
  if (existing) {
    await supabase.from('likes').delete().eq('post_id', post.id).eq('user_id', userId);
    return { liked: false };
  }
  await supabase.from('likes').insert({ post_id: post.id, user_id: userId });
  // notify author (not yourself)
  if (post.author_id !== userId) {
    await supabase.from('notifications').insert({
      user_id: post.author_id,
      actor_id: userId,
      type: 'like',
      post_id: post.id,
    });
  }
  return { liked: true };
}

// ---------------------------------------------------------------------------
// REPOSTS
// ---------------------------------------------------------------------------
export async function repost(post, userId) {
  const { data: existing } = await supabase
    .from('posts')
    .select('id')
    .eq('repost_of', post.id)
    .eq('author_id', userId)
    .maybeSingle();
  if (existing) {
    await supabase.from('posts').delete().eq('id', existing.id);
    return { reposted: false };
  }
  await createPost({ repostOf: post.id });
  if (post.author_id !== userId) {
    await supabase.from('notifications').insert({
      user_id: post.author_id,
      actor_id: userId,
      type: 'repost',
      post_id: post.id,
    });
  }
  return { reposted: true };
}

export async function isReposted(postId, userId) {
  if (!userId) return false;
  const { data } = await supabase
    .from('posts')
    .select('id')
    .eq('repost_of', postId)
    .eq('author_id', userId)
    .maybeSingle();
  return Boolean(data);
}

export async function repostCount(postId) {
  const { count } = await supabase
    .from('posts')
    .select('id', { count: 'exact', head: true })
    .eq('repost_of', postId);
  return count || 0;
}

// ---------------------------------------------------------------------------
// FOLLOWS
// ---------------------------------------------------------------------------
export async function getFollowingIds(userId) {
  const { data } = await supabase.from('follows').select('following_id').eq('follower_id', userId);
  return (data || []).map((r) => r.following_id);
}

export async function followersCount(userId) {
  const { count } = await supabase
    .from('follows')
    .select('id', { count: 'exact', head: true })
    .eq('following_id', userId);
  return count || 0;
}

export async function followingCount(userId) {
  const { count } = await supabase
    .from('follows')
    .select('id', { count: 'exact', head: true })
    .eq('follower_id', userId);
  return count || 0;
}

export async function isFollowing(userId, targetId) {
  if (!userId || !targetId) return false;
  const { data } = await supabase
    .from('follows')
    .select('follower_id')
    .eq('follower_id', userId)
    .eq('following_id', targetId)
    .maybeSingle();
  return Boolean(data);
}

export async function toggleFollow(userId, targetId) {
  const existing = await isFollowing(userId, targetId);
  if (existing) {
    await supabase.from('follows').delete().eq('follower_id', userId).eq('following_id', targetId);
    return { following: false };
  }
  await supabase.from('follows').insert({ follower_id: userId, following_id: targetId });
  await supabase.from('notifications').insert({
    user_id: targetId,
    actor_id: userId,
    type: 'follow',
  });
  return { following: true };
}

// Suggestions: a few profiles you don't follow yet
export async function suggestions(userId, limit = 5) {
  const following = await getFollowingIds(userId);
  let q = supabase.from('profiles').select('id, username, display_name, avatar_url').neq('id', userId).limit(limit);
  if (following.length) q = q.not('id', 'in', `(${following.join(',')})`);
  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

// ---------------------------------------------------------------------------
// NOTIFICATIONS
// ---------------------------------------------------------------------------
export async function fetchNotifications(userId) {
  const { data, error } = await supabase
    .from('notifications')
    .select(`*, actor:profiles!notifications_actor_id_fkey(id, username, display_name, avatar_url)`)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return data || [];
}

export async function markNotificationsRead(userId) {
  await supabase.from('notifications').update({ read: true }).eq('user_id', userId).eq('read', false);
}

export async function unreadCount(userId) {
  const { count } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('read', false);
  return count || 0;
}

// ---------------------------------------------------------------------------
// MESSAGING
// ---------------------------------------------------------------------------
export async function getOrCreateConversation(userId, otherId) {
  // find existing 1:1
  const { data: convs } = await supabase
    .from('conversations')
    .select('id')
    .in(
      'id',
      (await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', userId)).data?.map((r) => r.conversation_id) || []
    );
  for (const c of convs || []) {
    const { data: parts } = await supabase
      .from('conversation_participants')
      .select('user_id')
      .eq('conversation_id', c.id);
    if (parts && parts.length === 2 && parts.some((p) => p.user_id === otherId)) {
      return c.id;
    }
  }
  // create new
  const { data: conv, error } = await supabase.from('conversations').insert({}).select('id').single();
  if (error) throw error;
  await supabase.from('conversation_participants').insert([
    { conversation_id: conv.id, user_id: userId },
    { conversation_id: conv.id, user_id: otherId },
  ]);
  return conv.id;
}

export async function listConversations(userId) {
  const { data: parts } = await supabase
    .from('conversation_participants')
    .select('conversation_id')
    .eq('user_id', userId);
  const ids = (parts || []).map((p) => p.conversation_id);
  if (!ids.length) return [];
  const { data: convs } = await supabase
    .from('conversations')
    .select('id, updated_at')
    .in('id', ids)
    .order('updated_at', { ascending: false });
  return (convs || []).map((c) => ({ ...c, participants: [], last: null }));
}

export async function conversationWith(userId, convId) {
  const { data: parts } = await supabase
    .from('conversation_participants')
    .select('user_id, profiles!conversation_participants_user_id_fkey(id, username, display_name, avatar_url)')
    .eq('conversation_id', convId);
  const other = (parts || []).find((p) => p.user_id !== userId);
  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', convId)
    .order('created_at', { ascending: true });
  return { other: other?.profiles || null, messages: messages || [] };
}

export async function sendMessage(convId, senderId, { content = '', media = [] }) {
  const { data, error } = await supabase
    .from('messages')
    .insert({ conversation_id: convId, sender_id: senderId, content: content.trim() || null, media })
    .select('*')
    .single();
  if (error) throw error;
  await supabase.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', convId);
  return data;
}

// ---------------------------------------------------------------------------
// VIEWS
// ---------------------------------------------------------------------------
export async function recordView(postId, userId) {
  try {
    await supabase.rpc('record_view', { p_post_id: postId, p_user_id: userId || null });
  } catch (e) {
    // best-effort; ignore failures
  }
}

// ---------------------------------------------------------------------------
// MEDIA UPLOAD -> returns array of {type, url}
// ---------------------------------------------------------------------------
export async function uploadFiles(files) {
  const { data: user } = await supabase.auth.getUser();
  const uid = user.user.id;
  const out = [];
  for (const file of files) {
    const ext = (file.name.split('.').pop() || 'bin').toLowerCase();
    const path = `${uid}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { data, error } = await supabase.storage.from('media').upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    if (error) throw error;
    const url = supabase.storage.from('media').getPublicUrl(data.path).data.publicUrl;
    let type = 'file';
    if (file.type.startsWith('image/')) type = 'image';
    else if (file.type.startsWith('video/')) type = 'video';
    else if (file.type.startsWith('audio/')) type = 'audio';
    out.push({ type, url, name: file.name });
  }
  return out;
}

export async function uploadAvatar(file) {
  const { data: user } = await supabase.auth.getUser();
  const uid = user.user.id;
  const ext = (file.name.split('.').pop() || 'png').toLowerCase();
  const path = `${uid}/avatar.${ext}`;
  const { data, error } = await supabase.storage.from('avatars').upload(path, file, {
    contentType: file.type,
    upsert: true,
  });
  if (error) throw error;
  return supabase.storage.from('avatars').getPublicUrl(data.path).data.publicUrl;
}
