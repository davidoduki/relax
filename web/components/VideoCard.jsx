'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { TAG_LABEL } from '@/lib/constants';

export function VideoCard({ video }) {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('persian-music-favs') ?? '[]');
    setIsFav(favs.includes(video.id));
  }, [video.id]);

  const toggleFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const favs = JSON.parse(localStorage.getItem('persian-music-favs') ?? '[]');
    const next = isFav ? favs.filter(id => id !== video.id) : [...favs, video.id];
    localStorage.setItem('persian-music-favs', JSON.stringify(next));
    setIsFav(!isFav);
  };

  const publishedDate = video.published_at
    ? new Date(video.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  return (
    <Link
      href={`/video/${video.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl
                 bg-gradient-to-b from-navy-800/60 to-navy-900/80
                 border border-gold-800/20 hover:border-gold-600/40
                 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                 hover:shadow-crimson-900/20"
    >
      {/* Thumbnail */}
      <div className="aspect-[9/16] relative overflow-hidden bg-navy-800">
        {video.thumbnail_url ? (
          <img
            src={video.thumbnail_url}
            alt={video.title ?? 'Persian music video'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <ThumbnailPlaceholder />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-transparent" />

        {/* Play icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-14 h-14 rounded-full bg-gold-600/90 flex items-center justify-center backdrop-blur-sm">
            <svg className="w-6 h-6 text-navy-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Fav button */}
        <button
          onClick={toggleFav}
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-navy-900/60 backdrop-blur-sm
                     flex items-center justify-center text-base
                     opacity-0 group-hover:opacity-100 hover:scale-110 transition-all duration-200
                     border border-gold-800/30"
        >
          {isFav ? '❤️' : '🤍'}
        </button>

        {/* Tags overlay */}
        {video.tags?.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <div className="flex flex-wrap gap-1">
              {video.tags.slice(0, 3).map(tag => {
                const label = TAG_LABEL[tag];
                return (
                  <span key={tag} className="tag-pill text-[10px] px-2 py-0.5">
                    {label?.persian ?? tag}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Title + date */}
      <div className="p-3 flex-1">
        <p className="text-ivory-100 font-vazirmatn text-sm line-clamp-2 leading-relaxed" dir="rtl">
          {video.title ?? 'Untitled'}
        </p>
        {publishedDate && (
          <p className="text-ivory-200/40 text-xs mt-1.5 font-cormorant">{publishedDate}</p>
        )}
      </div>
    </Link>
  );
}

function ThumbnailPlaceholder() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy-800">
      <div className="flex items-end gap-1 h-12 text-gold-700/50">
        {Array.from({ length: 8 }, (_, i) => (
          <span
            key={i}
            className="waveform-bar"
            style={{
              height: `${16 + (i % 4) * 8}px`,
              '--dur': `${1.0 + i * 0.15}s`,
              '--delay': `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
      <p className="text-gold-800/40 font-vazirmatn text-xs mt-3">موسیقی ایرانی</p>
    </div>
  );
}
