import React, { useState } from 'react';
import { resolveMediaUrl } from '../lib/mediaAssets';
import { personInitials } from '../lib/people';

const SIZES = {
  lg: 'w-28 h-28 text-[2.25rem]',
  sm: 'w-14 h-14 text-lg',
} as const;

interface PersonAvatarProps {
  name: string;
  photoUrl?: string;
  size?: keyof typeof SIZES;
  className?: string;
}

/**
 * Circular profile image. Shows the person's photo when available; otherwise (or
 * if the photo fails to load) a Purdue black-and-gold initials avatar. The name is
 * always shown next to the avatar, so initials are hidden from screen readers.
 */
export const PersonAvatar: React.FC<PersonAvatarProps> = ({ name, photoUrl, size = 'lg', className = '' }) => {
  const [failed, setFailed] = useState(false);
  const src = resolveMediaUrl(photoUrl);
  const circle = `${SIZES[size]} shrink-0 rounded-full overflow-hidden border border-[#E5E2DC] ${className}`;

  if (!src || failed) {
    return (
      <div
        aria-hidden="true"
        className={`${circle} bg-black text-[#CFB991] font-display font-bold leading-none tracking-wide flex items-center justify-center select-none`}
      >
        {personInitials(name)}
      </div>
    );
  }

  return (
    <div className={`${circle} bg-neutral-100`}>
      <img
        src={src}
        alt={`Photo of ${name}`}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="w-full h-full object-cover object-top"
      />
    </div>
  );
};
