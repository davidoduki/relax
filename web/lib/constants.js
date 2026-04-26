export const DASTGAH_LIST = [
  { slug: 'shur', persian: 'شور', english: 'Shur' },
  { slug: 'mahour', persian: 'ماهور', english: 'Mahour' },
  { slug: 'homayoun', persian: 'همایون', english: 'Homayoun' },
  { slug: 'chahargah', persian: 'چهارگاه', english: 'Chahargah' },
  { slug: 'segah', persian: 'سه‌گاه', english: 'Segah' },
  { slug: 'nava', persian: 'نوا', english: 'Nava' },
  { slug: 'rast-panjgah', persian: 'راست‌پنجگاه', english: 'Rast-Panjgah' },
];

export const INSTRUMENT_LIST = [
  { slug: 'santour', persian: 'سنتور', english: 'Santour', icon: '🪘' },
  { slug: 'tar', persian: 'تار', english: 'Tar', icon: '🎸' },
  { slug: 'kamancheh', persian: 'کمانچه', english: 'Kamancheh', icon: '🎻' },
  { slug: 'daf', persian: 'دف', english: 'Daf', icon: '🥁' },
  { slug: 'setar', persian: 'سه‌تار', english: 'Setar', icon: '🎸' },
  { slug: 'ney', persian: 'نی', english: 'Ney', icon: '🪈' },
];

export const ALL_TAGS = [
  ...DASTGAH_LIST.map(d => ({ ...d, type: 'dastgah' })),
  ...INSTRUMENT_LIST.map(i => ({ ...i, type: 'instrument' })),
];

export const TAG_LABEL = Object.fromEntries(
  ALL_TAGS.map(t => [t.slug, { persian: t.persian, english: t.english }])
);
