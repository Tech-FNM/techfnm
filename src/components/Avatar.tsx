import { useState } from 'react';

const initials = (name = '') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('') || '•';

// Profile photo with an initials fallback. Google review avatars (lh3.googleusercontent.com) expire or
// get blocked, which used to leave a broken-image icon with the alt text spilling out.
export default function Avatar({ src, name, size = 48, className = '' }: { src?: string; name?: string; size?: number; className?: string }) {
  const [failed, setFailed] = useState(!src);
  if (failed) {
    return (
      <span
        role="img"
        aria-label={name || 'Client'}
        style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
        className={`inline-flex items-center justify-center rounded-full bg-gradient-to-br from-[#e5432e] to-[#8f2416] text-white font-bold shrink-0 select-none ${className}`}
      >
        {initials(name)}
      </span>
    );
  }
  return (
    <img
      src={src}
      alt={name || 'Client'}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      style={{ width: size, height: size }}
      className={`rounded-full object-cover shrink-0 ${className}`}
    />
  );
}
