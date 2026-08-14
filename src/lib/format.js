import { HANDLE_SUFFIX } from '../config.js';

// Format a number compactly: 1200 -> 1.2K, 2500000 -> 2.5M
export function formatCount(n) {
  const v = Number(n) || 0;
  if (v < 1000) return String(v);
  if (v < 1_000_000) return (v / 1000).toFixed(v < 10_000 ? 1 : 0).replace(/\.0$/, '') + 'K';
  if (v < 1_000_000_000) return (v / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  return (v / 1_000_000_000).toFixed(1) + 'B';
}

export function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return 'now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return d.toLocaleDateString();
}

export function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// full handle: username -> username.no.flw
export function handle(username) {
  if (!username) return '';
  return username.includes(HANDLE_SUFFIX) ? username : `${username}${HANDLE_SUFFIX}`;
}

export function stripHandle(h) {
  return h ? h.replace(HANDLE_SUFFIX, '') : h;
}

export function initials(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

// Validate a username for signup (matches the DB check constraint)
export function validUsername(u) {
  return /^[a-z0-9]([a-z0-9._-]{0,28}[a-z0-9])?$/.test(u || '');
}

export function detectMediaType(file) {
  const t = file.type || '';
  if (t.startsWith('image/')) return 'image';
  if (t.startsWith('video/')) return 'video';
  if (t.startsWith('audio/')) return 'audio';
  if (t.startsWith('text/') || t.includes('pdf') || t.includes('sheet') || t.includes('document'))
    return 'document';
  return 'file';
}

export function mediaColor(type) {
  return type === 'image'
    ? 'var(--deep-blue-2)'
    : type === 'video'
    ? 'var(--sky)'
    : type === 'audio'
    ? 'var(--deep-blue)'
    : 'var(--text-2)';
}
