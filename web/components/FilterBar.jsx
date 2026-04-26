'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useTransition } from 'react';
import { DASTGAH_LIST, INSTRUMENT_LIST } from '@/lib/constants';

export function FilterBar({ activeTag, activeSearch }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(activeSearch ?? '');

  const navigate = (params) => {
    const sp = new URLSearchParams();
    if (params.tag) sp.set('tag', params.tag);
    if (params.search) sp.set('search', params.search);
    const qs = sp.toString();
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname);
    });
  };

  const handleTagClick = (slug) => {
    navigate({ tag: activeTag === slug ? null : slug, search });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate({ tag: activeTag, search });
  };

  const clearAll = () => {
    setSearch('');
    startTransition(() => router.push(pathname));
  };

  const hasFilter = activeTag || activeSearch;

  return (
    <div className="py-6 space-y-4">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-lg">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by title or instrument... / جستجو"
          className="flex-1 bg-navy-800/60 border border-gold-800/30 rounded-xl px-4 py-2.5
                     text-ivory-100 placeholder-ivory-200/30 text-sm font-vazirmatn
                     focus:outline-none focus:border-gold-600/60 transition-colors"
          dir="auto"
        />
        <button type="submit" className="btn-gold px-4">
          Search
        </button>
        {hasFilter && (
          <button type="button" onClick={clearAll} className="btn-ghost px-4 text-sm">
            Clear
          </button>
        )}
      </form>

      {/* Dastgah filters */}
      <div className="space-y-2">
        <p className="text-xs text-ivory-200/40 font-vazirmatn uppercase tracking-widest">Dastgah</p>
        <div className="flex flex-wrap gap-2">
          {DASTGAH_LIST.map(d => (
            <button
              key={d.slug}
              onClick={() => handleTagClick(d.slug)}
              className={`tag-pill transition-all ${
                activeTag === d.slug
                  ? 'bg-crimson-700/80 text-gold-300 border-gold-600/60 scale-105'
                  : ''
              }`}
            >
              <span dir="rtl">{d.persian}</span>
              <span className="text-ivory-200/40 ml-1">({d.english})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Instrument filters */}
      <div className="space-y-2">
        <p className="text-xs text-ivory-200/40 font-vazirmatn uppercase tracking-widest">Instrument</p>
        <div className="flex flex-wrap gap-2">
          {INSTRUMENT_LIST.map(inst => (
            <button
              key={inst.slug}
              onClick={() => handleTagClick(inst.slug)}
              className={`tag-pill transition-all ${
                activeTag === inst.slug
                  ? 'bg-crimson-700/80 text-gold-300 border-gold-600/60 scale-105'
                  : ''
              }`}
            >
              <span>{inst.icon}</span>
              <span dir="rtl" className="ml-1">{inst.persian}</span>
            </button>
          ))}
        </div>
      </div>

      {isPending && (
        <p className="text-xs text-gold-600/60 font-vazirmatn animate-pulse">Filtering...</p>
      )}
    </div>
  );
}
