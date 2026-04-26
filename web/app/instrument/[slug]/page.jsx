import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { INSTRUMENT_LIST } from '@/lib/constants';
import { VideoGrid } from '@/components/VideoGrid';
import Link from 'next/link';

export const revalidate = 60;

export async function generateStaticParams() {
  return INSTRUMENT_LIST.map(i => ({ slug: i.slug }));
}

export async function generateMetadata({ params }) {
  const inst = INSTRUMENT_LIST.find(i => i.slug === params.slug);
  if (!inst) return {};
  return {
    title: `${inst.english} (${inst.persian}) — موسیقی ایرانی`,
    description: `All Persian music videos featuring the ${inst.english}.`,
  };
}

export default async function InstrumentPage({ params }) {
  const instrument = INSTRUMENT_LIST.find(i => i.slug === params.slug);
  if (!instrument) notFound();

  const { data: videos } = await supabase
    .from('videos')
    .select('id, title, tiktok_url, thumbnail_url, description, published_at, tags, play_count')
    .contains('tags', [instrument.slug])
    .order('published_at', { ascending: false });

  return (
    <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10 text-center">
        <p className="text-5xl mb-4">{instrument.icon}</p>
        <h1 className="font-cormorant font-light text-5xl text-ivory-100 mb-2">{instrument.english}</h1>
        <p className="font-vazirmatn text-2xl text-gold-500" dir="rtl">{instrument.persian}</p>
        <p className="text-ivory-200/40 font-cormorant mt-4">
          {videos?.length ?? 0} videos in the archive
        </p>
      </div>

      {/* Back link */}
      <div className="mb-8">
        <Link href="/" className="text-gold-600/70 hover:text-gold-400 font-cormorant text-sm transition-colors">
          ← Back to Archive
        </Link>
      </div>

      {videos?.length ? (
        <VideoGrid videos={videos} />
      ) : (
        <div className="text-center py-20 text-ivory-200/40">
          <p className="font-cormorant text-2xl">No videos yet for this instrument.</p>
          <p className="font-vazirmatn text-sm mt-2">Post on TikTok with #{instrument.persian} to populate this page.</p>
        </div>
      )}
    </main>
  );
}
