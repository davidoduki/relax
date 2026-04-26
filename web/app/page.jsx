import { supabase } from '@/lib/supabase';
import { HeroSection } from '@/components/HeroSection';
import { VideoGrid } from '@/components/VideoGrid';
import { FilterBar } from '@/components/FilterBar';

export const revalidate = 60; // ISR: revalidate every 60 seconds

async function getVideos({ tag, search } = {}) {
  let query = supabase
    .from('videos')
    .select('id, title, tiktok_url, thumbnail_url, description, published_at, tags, play_count')
    .order('published_at', { ascending: false });

  if (tag) {
    query = query.contains('tags', [tag]);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  const { data, error } = await query.limit(60);
  if (error) {
    console.error('Error fetching videos:', error.message);
    return [];
  }
  return data ?? [];
}

export default async function HomePage({ searchParams }) {
  const tag = searchParams?.tag ?? null;
  const search = searchParams?.search ?? null;
  const videos = await getVideos({ tag, search });

  return (
    <main>
      <HeroSection totalCount={videos.length} />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <FilterBar activeTag={tag} activeSearch={search} />

        {videos.length === 0 ? (
          <div className="text-center py-24 text-ivory-200/50">
            <p className="text-5xl mb-4">🎵</p>
            <p className="font-cormorant text-2xl">No videos found yet.</p>
            <p className="font-vazirmatn text-sm mt-2 text-ivory-200/40">
              Post on TikTok — it'll appear here automatically.
            </p>
          </div>
        ) : (
          <VideoGrid videos={videos} />
        )}
      </div>
    </main>
  );
}
