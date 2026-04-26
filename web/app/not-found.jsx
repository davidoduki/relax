import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <p className="font-cormorant text-8xl font-light text-gold-800/30 mb-4">404</p>
      <h1 className="font-cormorant text-3xl text-ivory-100 mb-2">Page Not Found</h1>
      <p className="font-vazirmatn text-ivory-200/40 text-sm mb-8">
        This page has drifted like a forgotten melody.
      </p>
      <Link href="/" className="btn-gold">Return to Archive</Link>
    </main>
  );
}
