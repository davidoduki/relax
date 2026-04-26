export const metadata = {
  title: 'Terms of Service — موسیقی ایرانی',
  description: 'Terms of Service for the Persian Music Archive.',
};

const SITE_URL = 'https://relax-production-0582.up.railway.app';
const CONTACT_EMAIL = 'contact@relax-production-0582.up.railway.app';
const LAST_UPDATED = 'April 26, 2026';

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <p className="text-gold-600 font-vazirmatn text-sm tracking-widest uppercase mb-3">Legal</p>
        <h1 className="font-cormorant font-light text-5xl text-ivory-100 mb-3">Terms of Service</h1>
        <p className="text-ivory-200/40 font-cormorant italic text-lg">
          Last updated: {LAST_UPDATED}
        </p>
      </div>

      <div className="space-y-10 font-cormorant text-ivory-200/80 leading-8 text-lg">

        <Section title="Acceptance of Terms">
          <p>
            By accessing or using the Persian Music Archive at{' '}
            <a href={SITE_URL} className="text-gold-500 hover:text-gold-400 underline underline-offset-2">{SITE_URL}</a>
            {' '}(&ldquo;the Site&rdquo;), you agree to be bound by these Terms of Service.
            If you do not agree with any part of these terms, please do not use the Site.
          </p>
        </Section>

        <Section title="About the Site">
          <p>
            The Persian Music Archive is a personal, non-commercial website that displays a
            curated collection of Persian classical and traditional music videos. All video
            content is sourced from TikTok and embedded via TikTok&rsquo;s official embed player.
            The Site does not host, re-upload, or distribute video files.
          </p>
        </Section>

        <Section title="Intellectual Property">
          <p>
            All video content displayed on the Site belongs to the original creator and is
            subject to TikTok&rsquo;s Terms of Service. The Site design, layout, and code are
            the property of the Site owner.
          </p>
          <p className="mt-3">
            You may not reproduce, distribute, or create derivative works from the Site&rsquo;s
            design or code without express written permission from the Site owner.
          </p>
        </Section>

        <Section title="Permitted Use">
          <p>You may use the Site to:</p>
          <ul className="list-disc list-inside space-y-1 mt-3 text-ivory-200/70">
            <li>Browse and watch embedded Persian music videos</li>
            <li>Search and filter the archive by instrument or musical mode (dastgah)</li>
            <li>Save favourites to your browser&rsquo;s local storage</li>
            <li>Share links to videos and pages on the Site</li>
          </ul>
        </Section>

        <Section title="Prohibited Use">
          <p>You may not use the Site to:</p>
          <ul className="list-disc list-inside space-y-1 mt-3 text-ivory-200/70">
            <li>Scrape, crawl, or systematically extract content in bulk</li>
            <li>Attempt to gain unauthorised access to any part of the Site or its backend</li>
            <li>Use automated tools to interact with the Site in a way that disrupts service</li>
            <li>Misrepresent the Site&rsquo;s content or claim ownership of embedded videos</li>
          </ul>
        </Section>

        <Section title="TikTok Integration">
          <p>
            This Site uses the TikTok API to retrieve and display video metadata. By viewing
            embedded TikTok content, you are also subject to{' '}
            <a href="https://www.tiktok.com/legal/terms-of-service" target="_blank" rel="noopener noreferrer"
               className="text-gold-500 hover:text-gold-400 underline underline-offset-2">
              TikTok&rsquo;s Terms of Service
            </a>.
            Any interaction with embedded TikTok players (likes, comments, follows) takes place
            directly on TikTok&rsquo;s platform.
          </p>
        </Section>

        <Section title="Disclaimer of Warranties">
          <p>
            The Site is provided &ldquo;as is&rdquo; without warranty of any kind, express or implied.
            We do not warrant that the Site will be uninterrupted, error-free, or that videos
            will remain available (as availability depends on TikTok&rsquo;s platform). We reserve
            the right to modify or discontinue the Site at any time without notice.
          </p>
        </Section>

        <Section title="Limitation of Liability">
          <p>
            To the fullest extent permitted by law, the Site owner shall not be liable for any
            indirect, incidental, or consequential damages arising out of your use of, or
            inability to use, the Site or its content.
          </p>
        </Section>

        <Section title="Changes to These Terms">
          <p>
            We may update these Terms of Service at any time. Changes will be indicated by an
            updated &ldquo;Last updated&rdquo; date. Continued use of the Site after any changes
            constitutes acceptance of the new terms.
          </p>
        </Section>

        <Section title="Governing Law">
          <p>
            These Terms are governed by and construed in accordance with applicable law.
            Any disputes arising from these Terms or your use of the Site shall be resolved
            in the appropriate courts of the jurisdiction in which the Site owner resides.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            For any questions regarding these Terms of Service, please contact us at:{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-gold-500 hover:text-gold-400 underline underline-offset-2">
              {CONTACT_EMAIL}
            </a>
          </p>
        </Section>

      </div>

      <div className="mt-16 pt-8 border-t border-gold-800/20">
        <a href="/privacy" className="text-gold-600/60 hover:text-gold-400 font-cormorant text-sm transition-colors">
          View Privacy Policy →
        </a>
      </div>
    </main>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="font-cormorant font-light text-2xl text-gold-400 mb-4 pb-2 border-b border-gold-800/20">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
