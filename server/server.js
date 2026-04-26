import express from 'express';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Persian instrument and dastgah keyword → tag mapping
const KEYWORD_TAGS = {
  'سنتور': 'santour',
  'تار': 'tar',
  'کمانچه': 'kamancheh',
  'دف': 'daf',
  'سه‌تار': 'setar',
  'نی': 'ney',
  'شور': 'shur',
  'ماهور': 'mahour',
  'همایون': 'homayoun',
  'چهارگاه': 'chahargah',
  'سه‌گاه': 'segah',
  'دشتی': 'dashti',
  'افشاری': 'afshari',
  'بیات اصفهان': 'bayat-esfahan',
  'بیات ترک': 'bayat-tork',
  'ابوعطا': 'abu-ata',
  'رهاب': 'rahab',
  'زابل': 'zabol',
  'مخالف': 'mokhalef',
  'شهناز': 'shahnaaz',
  'نوا': 'nava',
  'عراق': 'iraq',
  'راست‌پنجگاه': 'rast-panjgah',
};

function extractTags(text) {
  const tags = [];
  for (const [persian, english] of Object.entries(KEYWORD_TAGS)) {
    if (text?.includes(persian)) tags.push(english);
  }
  return tags;
}

function extractEmbedUrl(url) {
  const match = url?.match(/video\/(\d+)/);
  return match ? `https://www.tiktok.com/embed/v2/${match[1]}` : url;
}

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'Persian Music Server 🎵' });
});

app.post('/webhook/new-video', async (req, res) => {
  if (req.headers['x-webhook-secret'] !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { title, url, thumbnail, description, published_at } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'Missing required field: url' });
  }

  const tiktok_url = extractEmbedUrl(url);
  const combined = `${title ?? ''} ${description ?? ''}`;
  const tags = extractTags(combined);

  const { error } = await supabase.from('videos').upsert(
    { title, tiktok_url, thumbnail_url: thumbnail, description, published_at, tags },
    { onConflict: 'tiktok_url' }
  );

  if (error) {
    console.error('Supabase error:', error.message);
    return res.status(500).json({ error: 'Database error' });
  }

  console.log(`✅ Saved: ${title}`);
  return res.status(200).json({ success: true });
});

// Manual seed endpoint — protected, for backfilling existing videos
app.post('/admin/seed', async (req, res) => {
  if (req.headers['x-webhook-secret'] !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const videos = req.body.videos;
  if (!Array.isArray(videos)) {
    return res.status(400).json({ error: 'Expected { videos: [...] }' });
  }

  const rows = videos.map(v => ({
    title: v.title,
    tiktok_url: extractEmbedUrl(v.url),
    thumbnail_url: v.thumbnail,
    description: v.description,
    published_at: v.published_at,
    tags: extractTags(`${v.title ?? ''} ${v.description ?? ''}`),
  }));

  const { error } = await supabase.from('videos').upsert(rows, { onConflict: 'tiktok_url' });

  if (error) {
    console.error('Seed error:', error.message);
    return res.status(500).json({ error: 'Database error' });
  }

  return res.status(200).json({ success: true, count: rows.length });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🎵 Persian Music Server running on port ${PORT}`));
