export const metadata = {
  title: 'Privacy Policy — موسیقی ایرانی',
  description: 'Privacy Policy for the Persian Music Archive.',
};

const SITE_URL = 'https://relax-production-0582.up.railway.app';
const CONTACT_EMAIL = 'contact@relax-production-0582.up.railway.app';
const LAST_UPDATED = 'April 26, 2026';

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <p className="text-gold-600 font-vazirmatn text-sm tracking-widest uppercase mb-3">Legal</p>
        <h1 className="font-cormorant font-light text-5xl text-ivory-100 mb-3">Privacy Policy</h1>
        <p className="text-ivory-200/40 font-cormorant italic text-lg">
          Last updated: {LAST_UPDATED}
        </p>
      </div>

      <div className="space-y-10 font-cormorant text-ivory-200/80 leading-8 text-lg">

        <Section title="Overview">
          <p>
            This Privacy Policy describes how the Persian Music Archive (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;),
            accessible at <a href={SITE_URL} className="text-gold-500 hover:text-gold-400 underline underline-offset-2">{SITE_URL}</a>,
            handles information when you visit our website. We are committed to protecting your privacy.
            This site is a personal archive of Persian classical and traditional music videos and
            does not collect personal information from visitors.
          </p>
        </Section>

        <Section title="Information We Do Not Collect">
          <p>We do <strong className="text-ivory-100">not</strong> collect, store, or process:</p>
          <ul className="list-disc list-inside space-y-1 mt-3 text-ivory-200/70">
            <li>Your name, email address, or any personal identifiers</li>
            <li>Account registration or login credentials</li>
            <li>Payment or financial information</li>
            <li>Device identifiers or persistent tracking cookies</li>
            <li>IP addresses tied to individual user profiles</li>
          </ul>
        </Section>

        <Section title="Local Storage (Favorites)">
          <p>
            Our website offers a &ldquo;Favorites&rdquo; feature that lets you save videos you enjoy.
            This preference is stored exclusively in your browser&rsquo;s <strong className="text-ivory-100">localStorage</strong> —
            a mechanism that keeps data on your device only. This data is never transmitted to our
            servers and is deleted when you clear your browser data.
          </p>
        </Section>

        <Section title="TikTok Content">
          <p>
            Videos displayed on this site are embedded directly from TikTok using TikTok&rsquo;s
            official embed player (<code className="text-gold-400 text-base bg-navy-800/60 px-1.5 py-0.5 rounded">tiktok.com/embed/v2/</code>).
            When a video plays, TikTok&rsquo;s own servers handle the stream. TikTok may collect data
            according to their own privacy policy. We encourage you to review{' '}
            <a href="https://www.tiktok.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer"
               className="text-gold-500 hover:text-gold-400 underline underline-offset-2">
              TikTok&rsquo;s Privacy Policy
            </a>.
          </p>
          <p className="mt-4">
            Video metadata (titles, thumbnails, descriptions, publish dates) is retrieved via the
            TikTok API using credentials belonging to the site owner and stored in a private
            database. This metadata is only used to display and organise videos on this site.
          </p>
        </Section>

        <Section title="Third-Party Services">
          <p>This website is hosted on Railway and uses Supabase for its database. Neither service
          is used to track individual visitors. Please refer to their respective privacy policies:</p>
          <ul className="list-disc list-inside space-y-1 mt-3 text-ivory-200/70">
            <li>
              <a href="https://railway.app/legal/privacy" target="_blank" rel="noopener noreferrer"
                 className="text-gold-500 hover:text-gold-400 underline underline-offset-2">
                Railway Privacy Policy
              </a>
            </li>
            <li>
              <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer"
                 className="text-gold-500 hover:text-gold-400 underline underline-offset-2">
                Supabase Privacy Policy
              </a>
            </li>
          </ul>
        </Section>

        <Section title="Children's Privacy">
          <p>
            This website is not directed at children under the age of 13. We do not knowingly
            collect any information from children. If you believe a child has provided information
            to us, please contact us and we will address it promptly.
          </p>
        </Section>

        <Section title="Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. Any changes will be reflected by
            an updated &ldquo;Last updated&rdquo; date at the top of this page. Continued use of the site
            after changes constitutes acceptance of the updated policy.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            If you have any questions about this Privacy Policy, you may contact us at:{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-gold-500 hover:text-gold-400 underline underline-offset-2">
              {CONTACT_EMAIL}
            </a>
          </p>
        </Section>

      </div>

      <div className="mt-16 pt-8 border-t border-gold-800/20">
        <a href="/terms" className="text-gold-600/60 hover:text-gold-400 font-cormorant text-sm transition-colors">
          View Terms of Service →
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
