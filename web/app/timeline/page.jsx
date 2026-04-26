import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { TAG_LABEL } from '@/lib/constants';

export const revalidate = 60;
export const metadata = {
  title: 'Timeline — موسیقی ایرانی',
  description: 'Browse Persian music videos by date.',
};

async function getVideosByMonth() {
  const { data } = await supabase
    .from('videos')
    .select('id, title, thumbnail_url, tags, published_at')
    .order('published_at', { ascending: false })
    .limit(200);

  if (!data) return [];

  // Group by YYYY-MM
  const groups = {};
  for (const v of data) {
    if (!v.published_at) continue;
    const date = new Date(v.published_at);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const label = date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    if (!groups[key]) groups[key] = { label, videos: [] };
    groups[key].videos.push(v);
  }

  return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
}

export default async function TimelinePage() {
  const groups = await getVideosByMonth();

  return (
    <main className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-cormorant font-light text-5xl text-ivory-100 mb-2">Timeline</h1>
      <p className="text-ivory-200/40 font-cormorant italic text-lg mb-12">
        A chronological journey through the archive.
      </p>

      {groups.length === 0 ? (
        <div className="text-center py-20 text-ivory-200/40 font-cormorant text-2xl">
          No videos yet.
        </div>
      ) : (
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-gold-800/60 via-gold-800/20 to-transparent" />

          <div className="space-y-12 pl-12">
            {groups.map(([key, { label, videos }]) => (
              <section key={key}>
                {/* Month marker */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="absolute left-0 w-9 h-9 rounded-full bg-navy-900 border-2 border-gold-700/60 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-gold-600" />
                  </div>
                  <h2 className="font-cormorant text-2xl text-gold-400 font-light">{label}</h2>
                  <span className="text-ivory-200/30 text-sm font-vazirmatn">{videos.length} videos</span>
                </div>

                {/* Video row */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {videos.map(v => (
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
                          <div className="absolute inset-0 flex items-center justify-center text-gold-800/30 text-xl">🎵</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-2">
                          <p className="font-vazirmatn text-[10px] text-ivory-100/70 line-clamp-2" dir="rtl">{v.title}</p>
                          {v.tags?.length > 0 && (
                            <p className="text-gold-600/60 text-[9px] mt-0.5 font-cormorant">
                              {TAG_LABEL[v.tags[0]]?.english ?? v.tags[0]}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
