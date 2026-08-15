// Central runtime config. Values come from env vars (see .env.example).
// `configured` is false until you add a Supabase URL + anon key.

const env = (k) => import.meta.env[k];

export const SUPABASE_URL = env('VITE_SUPABASE_URL');
export const SUPABASE_ANON_KEY = env('VITE_SUPABASE_ANON_KEY');

// App identity
export const APP_NAME = 'Flow';
export const HANDLE_SUFFIX = '.no.flw';

// Media upload limits (bytes)
export const MAX_IMAGE = 10 * 1024 * 1024; // 10 MB
export const MAX_VIDEO = 50 * 1024 * 1024; // 50 MB
export const MAX_AVATAR = 5 * 1024 * 1024; // 5 MB

// A nice-to-have: keep URLs stable regardless of hosting base.
export const BASE_URL = import.meta.env.BASE_URL; // e.g. '/Flow.web/'

export const configured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

// Compose a public profile URL, e.g. https://no-group.github.io/Flow.web/user.name.no.flw
export function profileUrl(username) {
  const base = window.location.origin + BASE_URL;
  return `${base}${username}${HANDLE_SUFFIX}`;
}
