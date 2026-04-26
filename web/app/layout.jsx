import './globals.css';
import { NavBar } from '@/components/NavBar';
import { NowPlayingBar } from '@/components/NowPlayingBar';

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
        <NowPlayingBar />
      </body>
    </html>
  );
}
