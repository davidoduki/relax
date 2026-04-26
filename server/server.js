import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { fetchAllVideos, normalizeTikTokVideo, refreshAccessToken } from './lib/tiktok.js';

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

// ─── TikTok sync ────────────────────────────────────────────────────────────

/**
 * Pull all videos from TikTok API and upsert into Supabase.
 * Returns { saved, skipped, error? }
 */
async function syncFromTikTok() {
  const token = process.env.TIKTOK_ACCESS_TOKEN;
  if (!token) {
    return { saved: 0, skipped: 0, error: 'TIKTOK_ACCESS_TOKEN not set' };
  }

  let accessToken = token;

  // Try fetch; if 401, attempt token refresh once
  let videos;
  try {
    videos = await fetchAllVideos(accessToken);
  } catch (err) {
    if (err.message.includes('401') && process.env.TIKTOK_CLIENT_KEY) {
      console.log('TikTok token expired — refreshing...');
      try {
        const refreshed = await refreshAccessToken();
        accessToken = refreshed.access_token;
        console.log('Token refreshed. New token starts with:', accessToken.slice(0, 8) + '…');
        videos = await fetchAllVideos(accessToken);
      } catch (refreshErr) {
        return { saved: 0, skipped: 0, error: `Token refresh failed: ${refreshErr.message}` };
      }
    } else {
      return { saved: 0, skipped: 0, error: err.message };
    }
  }

  if (!videos.length) {
    return { saved: 0, skipped: 0 };
  }

  const rows = videos.map(v => {
    const base = normalizeTikTokVideo(v);
    const combined = `${base.title ?? ''} ${base.description ?? ''}`;
    return { ...base, tags: extractTags(combined) };
  });

  const { error } = await supabase
    .from('videos')
    .upsert(rows, { onConflict: 'tiktok_url' });

  if (error) {
    return { saved: 0, skipped: 0, error: `Supabase error: ${error.message}` };
  }

  console.log(`✅ TikTok sync: ${rows.length} videos upserted`);
  return { saved: rows.length, skipped: 0 };
}

// ─── Routes ─────────────────────────────────────────────────────────────────

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Persian Music Server 🎵',
    tiktok_configured: !!process.env.TIKTOK_ACCESS_TOKEN,
    supabase_configured: !!process.env.SUPABASE_URL,
  });
});

// Webhook — called by Zapier/Make when a new TikTok is posted
app.post('/webhook/new-video', async (req, res) => {
  if (req.headers['x-webhook-secret'] !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { title, url, thumbnail, description, published_at } = req.body;
  if (!url) return res.status(400).json({ error: 'Missing required field: url' });

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

  console.log(`✅ Webhook saved: ${title}`);
  return res.status(200).json({ success: true });
});

// Manual full sync from TikTok API — protected
app.post('/admin/sync-tiktok', async (req, res) => {
  if (req.headers['x-webhook-secret'] !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  console.log('🔄 Manual TikTok sync triggered...');
  const result = await syncFromTikTok();

  if (result.error) {
    console.error('Sync error:', result.error);
    return res.status(500).json({ error: result.error });
  }

  return res.status(200).json({ success: true, ...result });
});

// Manual seed endpoint — for backfilling from JSON
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

// ─── Startup ─────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  console.log(`🎵 Persian Music Server running on port ${PORT}`);

  // Auto-sync from TikTok on startup if credentials are present
  if (process.env.TIKTOK_ACCESS_TOKEN) {
    console.log('🔄 Auto-syncing TikTok videos on startup...');
    const result = await syncFromTikTok();
    if (result.error) {
      console.error('Startup sync error:', result.error);
    } else {
      console.log(`Startup sync complete: ${result.saved} videos`);
    }
  } else {
    console.log('ℹ️  TIKTOK_ACCESS_TOKEN not set — skipping auto-sync');
  }
});
