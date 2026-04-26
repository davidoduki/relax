'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Minimal global state via module-level variable + custom event
let currentVideo = null;

export function setNowPlaying(video) {
  currentVideo = video;
  window.dispatchEvent(new Event('now-playing-changed'));
}

export function NowPlayingBar() {
  const [video, setVideo] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handler = () => setVideo(currentVideo);
    window.addEventListener('now-playing-changed', handler);
    return () => window.removeEventListener('now-playing-changed', handler);
  }, []);

  if (!video) return null;

  return (
    <div className={`fixed bottom-0 inset-x-0 z-50 transition-transform duration-300 ${
      collapsed ? 'translate-y-[calc(100%-3rem)]' : ''
    }`}>
      <div className="bg-navy-950/95 backdrop-blur-md border-t border-gold-800/30 px-4 py-3">
        <div className="max-w-screen-2xl mx-auto flex items-center gap-4">

          {/* Waveform animation */}
          <div className="flex items-end gap-0.5 h-6 text-gold-600 shrink-0">
            {Array.from({ length: 6 }, (_, i) => (
              <span
                key={i}
                className="waveform-bar"
                style={{ height: `${10 + (i % 3) * 5}px`, '--dur': `${0.9 + i * 0.12}s`, '--delay': `${i * 0.08}s` }}
              />
            ))}
          </div>

          {/* Thumbnail */}
          {video.thumbnail_url && (
            <img
              src={video.thumbnail_url}
              alt={video.title}
              className="w-10 h-10 rounded-lg object-cover shrink-0 border border-gold-800/30"
            />
          )}

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-ivory-100 font-vazirmatn text-sm truncate" dir="rtl">{video.title}</p>
            <p className="text-gold-600/70 text-xs font-cormorant">Now Playing</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href={`/video/${video.id}`} className="btn-ghost text-xs px-3 py-1.5">
              Open
            </Link>
            <button
              onClick={() => setCollapsed(v => !v)}
              className="text-ivory-200/40 hover:text-ivory-200/70 text-xs transition-colors"
              aria-label={collapsed ? 'Expand' : 'Collapse'}
            >
              {collapsed ? '▲' : '▼'}
            </button>
            <button
              onClick={() => setVideo(null)}
              className="text-ivory-200/40 hover:text-ivory-200/70 transition-colors text-sm"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
