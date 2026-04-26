const TIKTOK_API = 'https://open.tiktokapis.com/v2';

// Fields requested from the TikTok video list API
const VIDEO_FIELDS = [
  'id',
  'title',
  'video_description',
  'create_time',
  'cover_image_url',
  'share_url',
  'duration',
].join(',');

/**
 * Exchange a refresh token for a new access token.
 * Call this whenever you get a 401 from the video list endpoint.
 */
export async function refreshAccessToken() {
  const res = await fetch(`${TIKTOK_API}/oauth/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_key: process.env.TIKTOK_CLIENT_KEY,
      client_secret: process.env.TIKTOK_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: process.env.TIKTOK_REFRESH_TOKEN,
    }),
  });

  if (!res.ok) {
    throw new Error(`TikTok token refresh failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  if (data.error) {
    throw new Error(`TikTok token error: ${data.error_description ?? data.error}`);
  }

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_in: data.expires_in,
  };
}

/**
 * Fetch one page of videos from the TikTok video list API.
 * @param {string} accessToken
 * @param {number} cursor  Pagination cursor (0 = first page)
 * @param {number} maxCount  Max per page (TikTok cap: 20)
 */
async function fetchVideoPage(accessToken, cursor = 0, maxCount = 20) {
  const res = await fetch(`${TIKTOK_API}/video/list/?fields=${VIDEO_FIELDS}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ max_count: maxCount, cursor }),
  });

  if (!res.ok) {
    throw new Error(`TikTok video list failed: ${res.status} ${await res.text()}`);
  }

  const json = await res.json();

  if (json.error?.code && json.error.code !== 'ok') {
    throw new Error(`TikTok API error: ${json.error.message} (${json.error.code})`);
  }

  return json.data; // { videos: [...], cursor, has_more }
}

/**
 * Fetch ALL videos for the authenticated user, paging through results.
 * Returns an array of raw TikTok video objects.
 */
export async function fetchAllVideos(accessToken) {
  const all = [];
  let cursor = 0;
  let hasMore = true;

  while (hasMore) {
    const page = await fetchVideoPage(accessToken, cursor);
    if (!page?.videos?.length) break;

    all.push(...page.videos);
    hasMore = page.has_more ?? false;
    cursor = page.cursor ?? 0;

    // Safety: TikTok rate limits ~3 req/s — small delay between pages
    if (hasMore) await new Promise(r => setTimeout(r, 400));
  }

  return all;
}

/**
 * Convert a raw TikTok video object into the shape stored in Supabase.
 */
export function normalizeTikTokVideo(v) {
  return {
    tiktok_url: `https://www.tiktok.com/embed/v2/${v.id}`,
    title: v.title || v.video_description || null,
    description: v.video_description || null,
    thumbnail_url: v.cover_image_url || null,
    published_at: v.create_time ? new Date(v.create_time * 1000).toISOString() : null,
  };
}
