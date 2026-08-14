-- ============================================================================
-- FLOW — enable Realtime for live updates.
-- Run after schema.sql in the Supabase SQL editor.
-- ============================================================================

alter publication supabase_realtime add table public.posts;
alter publication supabase_realtime add table public.likes;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.conversations;
alter publication supabase_realtime add table public.conversation_participants;
alter publication supabase_realtime add table public.follows;
