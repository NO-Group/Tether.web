import { mediaColor } from '../lib/format.js';

// Renders a post/message media array. Supports image, video, audio, document/file.
export default function MediaViewer({ media = [], grid = true }) {
  if (!media || !media.length) return null;

  const images = media.filter((m) => m.type === 'image');
  const gridCount = images.length > 1 ? 'grid-2' : '';

  return (
    <div className={`post-media ${gridCount}`}>
      {images.map((m, i) => (
        <div className="frame" key={i} style={{ gridRow: images.length === 3 && i === 0 ? 'span 2' : undefined }}>
          <img src={m.url} alt={m.alt || ''} loading="lazy" />
        </div>
      ))}
      {media
        .filter((m) => m.type === 'video')
        .map((m, i) => (
          <div className="frame" key={i}>
            <video src={m.url} controls playsInline preload="metadata" />
          </div>
        ))}
      {media
        .filter((m) => m.type === 'audio')
        .map((m, i) => (
          <audio key={i} controls src={m.url} style={{ width: '100%' }} />
        ))}
      {media
        .filter((m) => m.type === 'document' || m.type === 'file' || (m.type !== 'image' && m.type !== 'video' && m.type !== 'audio'))
        .map((m, i) => (
          <a className="doc-chip" key={i} href={m.url} target="_blank" rel="noreferrer">
            <span
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'var(--accent-soft)',
                color: mediaColor(m.type),
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
              }}
            >
              {(m.name || 'F').slice(0, 1).toUpperCase()}
            </span>
            <span>
              <strong>{m.name || 'Attachment'}</strong>
              <span className="muted-3" style={{ display: 'block' }}>
                Open file
              </span>
            </span>
          </a>
        ))}
    </div>
  );
}
