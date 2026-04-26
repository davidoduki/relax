import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET() {
  const { count } = await supabase.from('videos').select('*', { count: 'exact', head: true });

  if (!count) {
    return NextResponse.json({ error: 'No videos' }, { status: 404 });
  }

  const offset = Math.floor(Math.random() * count);
  const { data } = await supabase
    .from('videos')
    .select('id')
    .range(offset, offset);

  if (!data?.[0]) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ id: data[0].id });
}
