'use client';

import Link from 'next/link';
import { useState } from 'react';
import { INSTRUMENT_LIST } from '@/lib/constants';

export function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-navy-950/80 backdrop-blur-md border-b border-gold-800/20">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <WaveformIcon />
          <span className="font-cormorant text-xl font-light text-ivory-100 tracking-widest group-hover:text-gold-400 transition-colors">
            موسیقی ایرانی
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink href="/">Archive</NavLink>
          <NavLink href="/timeline">Timeline</NavLink>
          <div className="relative group">
            <button className="text-ivory-200/70 hover:text-gold-400 text-sm font-cormorant tracking-wide transition-colors">
              Instruments ▾
            </button>
            <div className="absolute top-full right-0 mt-2 w-44 glass-card py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              {INSTRUMENT_LIST.map(inst => (
                <Link
                  key={inst.slug}
                  href={`/instrument/${inst.slug}`}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-ivory-200/80 hover:text-gold-400 hover:bg-navy-700/50 transition-colors font-vazirmatn"
                >
                  <span>{inst.icon}</span>
                  <span dir="rtl">{inst.persian}</span>
                  <span className="text-ivory-200/40 text-xs">({inst.english})</span>
                </Link>
              ))}
            </div>
          </div>
          <NavLink href="/favorites">Favorites</NavLink>
        </div>

        {/* Random button */}
        <div className="hidden md:flex items-center gap-3">
          <RandomButton />
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-ivory-200/70 hover:text-gold-400 transition-colors"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-navy-900/95 border-t border-gold-800/20 px-4 py-4 flex flex-col gap-3">
          <MobileNavLink href="/" onClick={() => setMenuOpen(false)}>Archive</MobileNavLink>
          <MobileNavLink href="/timeline" onClick={() => setMenuOpen(false)}>Timeline</MobileNavLink>
          <MobileNavLink href="/favorites" onClick={() => setMenuOpen(false)}>Favorites</MobileNavLink>
          <hr className="border-gold-800/20" />
          {INSTRUMENT_LIST.map(inst => (
            <MobileNavLink key={inst.slug} href={`/instrument/${inst.slug}`} onClick={() => setMenuOpen(false)}>
              {inst.icon} {inst.english}
            </MobileNavLink>
          ))}
          <div className="mt-2">
            <RandomButton />
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, children }) {
  return (
    <Link href={href} className="text-ivory-200/70 hover:text-gold-400 text-sm font-cormorant tracking-wide transition-colors">
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }) {
  return (
    <Link href={href} onClick={onClick} className="text-ivory-100 font-cormorant text-lg py-1 hover:text-gold-400 transition-colors">
      {children}
    </Link>
  );
}

function WaveformIcon() {
  return (
    <div className="flex items-end gap-0.5 h-5 text-gold-600">
      {[1.2, 1.8, 1.0, 1.6, 0.8, 1.4, 1.0].map((dur, i) => (
        <span
          key={i}
          className="waveform-bar"
          style={{ '--dur': `${dur}s`, '--delay': `${i * 0.1}s`, height: `${10 + i % 3 * 4}px` }}
        />
      ))}
    </div>
  );
}

function RandomButton() {
  const handleRandom = async () => {
    try {
      const res = await fetch('/api/random');
      const { id } = await res.json();
      if (id) window.location.href = `/video/${id}`;
    } catch {}
  };

  return (
    <button onClick={handleRandom} className="btn-ghost text-sm flex items-center gap-2">
      <span>🔀</span> Surprise me
    </button>
  );
}
