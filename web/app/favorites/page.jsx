'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { VideoGrid } from '@/components/VideoGrid';
import Link from 'next/link';

export default function FavoritesPage() {
  const [videos, setVideos] = useState(null);

  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem('persian-music-favs') ?? '[]');
    if (!ids.length) {
      setVideos([]);
      return;
    }

    supabase
      .from('videos')
      .select('id, title, tiktok_url, thumbnail_url, description, published_at, tags, play_count')
      .in('id', ids)
      .order('published_at', { ascending: false })
      .then(({ data }) => setVideos(data ?? []));
  }, []);

  return (
    <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-cormorant font-light text-5xl text-ivory-100 mb-2">Favorites</h1>
      <p className="text-ivory-200/40 font-cormorant italic text-lg mb-10">
        Your saved Persian music moments.
      </p>

      <div className="mb-6">
        <Link href="/" className="text-gold-600/70 hover:text-gold-400 font-cormorant text-sm transition-colors">
          ← Back to Archive
        </Link>
      </div>

      {videos === null && (
        <div className="flex items-center gap-3 py-20 justify-center text-ivory-200/40">
          <div className="w-5 h-5 border-2 border-gold-700/40 border-t-gold-600 rounded-full animate-spin" />
          <span className="font-cormorant text-lg">Loading...</span>
        </div>
      )}

      {videos?.length === 0 && (
        <div className="text-center py-20 space-y-4">
          <p className="text-4xl">🤍</p>
          <p className="font-cormorant text-2xl text-ivory-100/60">No favorites yet.</p>
          <p className="font-vazirmatn text-sm text-ivory-200/30">
            Tap the heart icon on any video to save it here.
          </p>
          <Link href="/" className="inline-block btn-gold mt-4">Browse Archive</Link>
        </div>
      )}

      {videos?.length > 0 && <VideoGrid videos={videos} />}
    </main>
  );
}
