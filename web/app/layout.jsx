import './globals.css';
import { NavBar } from '@/components/NavBar';
import { NowPlayingBar } from '@/components/NowPlayingBar';
import Link from 'next/link';

export const metadata = {
  title: 'موسیقی ایرانی — Persian Music Archive',
  description: 'A living archive of Persian classical and traditional music from TikTok.',
  openGraph: {
    title: 'موسیقی ایرانی — Persian Music Archive',
    description: 'A living archive of Persian classical and traditional music.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen antialiased">
        <NavBar />
        <div className="pt-16">
          {children}
        </div>
        <footer className="border-t border-gold-800/20 mt-20 py-8 px-4">
          <div className="max-w-screen-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-ivory-200/30 font-cormorant">
            <p>© {new Date().getFullYear()} موسیقی ایرانی — Persian Music Archive</p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-gold-400 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-gold-400 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </footer>
        <NowPlayingBar />
      </body>
    </html>
  );
}
