'use client';

import { useEffect, useRef } from 'react';
import { setNowPlaying } from './NowPlayingBar';

export function VideoPlayer({ video }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    setNowPlaying(video);
    return () => setNowPlaying(null);
  }, [video]);

  return (
    <div className="sticky top-20 space-y-4">
      <div className="aspect-[9/16] w-full max-w-[360px] mx-auto rounded-2xl overflow-hidden border border-gold-800/30 bg-navy-800 shadow-2xl shadow-navy-950/60">
        <iframe
          ref={iframeRef}
          src={video.tiktok_url}
          className="w-full h-full"
          allowFullScreen
          allow="autoplay; encrypted-media"
          title={video.title ?? 'Persian music video'}
        />
      </div>
    </div>
  );
}
