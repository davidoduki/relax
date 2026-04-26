import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { TAG_LABEL } from '@/lib/constants';
import Link from 'next/link';
import { VideoPlayer } from '@/components/VideoPlayer';

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { data } = await supabase
    .from('videos')
    .select('title, description, thumbnail_url')
    .eq('id', params.id)
    .single();

  if (!data) return { title: 'Video — Persian Music Archive' };

  return {
    title: `${data.title ?? 'Video'} — موسیقی ایرانی`,
    description: data.description?.slice(0, 160),
    openGraph: {
      images: data.thumbnail_url ? [{ url: data.thumbnail_url }] : [],
    },
  };
}

async function getVideo(id) {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data;
}

async function getRelated(video) {
  if (!video.tags?.length) return [];
  const { data } = await supabase
    .from('videos')
    .select('id, title, thumbnail_url, tags, published_at')
    .contains('tags', [video.tags[0]])
    .neq('id', video.id)
    .order('published_at', { ascending: false })
    .limit(6);
  return data ?? [];
}

export default async function VideoPage({ params }) {
  const video = await getVideo(params.id);
  if (!video) notFound();

  const related = await getRelated(video);

  const publishedDate = video.published_at
    ? new Date(video.published_at).toLocaleDateString('en-GB', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      })
    : null;

  return (
    <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-10">

        {/* Video embed */}
        <div className="w-full lg:w-[360px] shrink-0">
          <VideoPlayer video={video} />
        </div>

        {/* Info panel */}
        <div className="flex-1 space-y-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-ivory-200/40 font-cormorant">
            <Link href="/" className="hover:text-gold-400 transition-colors">Archive</Link>
            <span>/</span>
            <span className="text-ivory-200/70">{video.title?.slice(0, 40)}</span>
          </nav>

          {/* Title */}
          <div>
            <h1 className="font-cormorant font-light text-4xl text-ivory-100 leading-snug" dir="rtl">
              {video.title ?? 'Untitled'}
            </h1>
            {publishedDate && (
              <p className="text-gold-700/70 font-cormorant italic text-lg mt-2">{publishedDate}</p>
            )}
          </div>

          {/* Tags */}
          {video.tags?.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-ivory-200/40 font-vazirmatn uppercase tracking-widest">Tags</p>
              <div className="flex flex-wrap gap-2">
                {video.tags.map(tag => {
                  const label = TAG_LABEL[tag];
                  return (
                    <Link key={tag} href={`/?tag=${tag}`} className="tag-pill">
                      {label ? (
                        <>
                          <span dir="rtl">{label.persian}</span>
                          <span className="text-ivory-200/40 ml-1 text-[10px]">({label.english})</span>
                        </>
                      ) : tag}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Description */}
          {video.description && (
            <div className="glass-card p-5 space-y-2">
              <p className="text-xs text-ivory-200/40 font-vazirmatn uppercase tracking-widest">Description</p>
              <p className="font-vazirmatn text-ivory-200/80 text-sm leading-7 whitespace-pre-line" dir="rtl">
                {video.description}
              </p>
            </div>
          )}

          {/* Open on TikTok */}
          <a
            href={video.tiktok_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 btn-ghost text-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.77a4.86 4.86 0 01-1.01-.08z"/>
            </svg>
            View on TikTok
          </a>
        </div>
      </div>

      {/* Related videos */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="section-title mb-6">Related Videos</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {related.map(v => (
              <Link
                key={v.id}
                href={`/video/${v.id}`}
                className="group relative overflow-hidden rounded-xl border border-gold-800/20 hover:border-gold-600/40 transition-all"
              >
                <div className="aspect-[9/16] relative bg-navy-800 overflow-hidden">
                  {v.thumbnail_url ? (
                    <img
                      src={v.thumbnail_url}
                      alt={v.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-navy-800 flex items-center justify-center text-gold-800/30 text-2xl">🎵</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 to-transparent" />
                  <p className="absolute bottom-0 left-0 right-0 p-2 font-vazirmatn text-xs text-ivory-100/80 line-clamp-2" dir="rtl">
                    {v.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
