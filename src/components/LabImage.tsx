import React, { useState } from 'react';
import { Microscope } from 'lucide-react';
import { resolveMediaUrl } from '../lib/mediaAssets';

interface LabImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export const LabImage: React.FC<LabImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackLabel,
}) => {
  const [failed, setFailed] = useState(false);
  const resolved = resolveMediaUrl(src);

  if (!resolved || failed) {
    return (
      <div className="w-full h-full min-h-[180px] bg-gradient-to-br from-[#141414] via-[#26221B] to-[#3A3020] flex flex-col items-center justify-center p-6 text-center text-[#CFB991]">
        <Microscope className="w-8 h-8 mb-2 opacity-80" strokeWidth={1.5} />
        <span className="text-xs font-medium tracking-wide text-[#E8DEC8] max-w-xs">
          {fallbackLabel || alt || 'Purdue University Laboratory'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={resolved}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
