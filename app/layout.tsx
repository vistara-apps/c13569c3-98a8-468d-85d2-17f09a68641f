import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'DuaFlow - Never miss a spiritual practice',
  description: 'Organize your divine connections with daily Dua reminders and smart bookmark organization.',
  keywords: ['dua', 'islamic', 'spiritual', 'reminders', 'bookmarks', 'base', 'miniapp'],
  authors: [{ name: 'DuaFlow Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#10b981',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
