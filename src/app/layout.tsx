import type { Metadata } from 'next';
import '@/styles/globals.scss';
import Header from '@/components/organisms/Header';
import SideNavigation from '@/components/organisms/Navigation/SideNavigation';
import { createClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
  title: 'メモレシピアプリ',
  description:
    '美味しかったレシピを簡単にメモし、複数のデバイスで同期できるアプリ',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  return (
    <html lang="ja">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com/"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?display=swap&family=Epilogue:wght@400;500;700;900&family=Noto+Sans:wght@400;500;700;900"
        />
        <link rel="icon" href="/icons/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="/icons/icon-192x192.png"
          type="image/png"
          sizes="192x192"
        />
        <link rel="apple-touch-icon" href="/icons/apple-icon-180x180.png" />
      </head>
      <body>
        <div className="app-container">
          <Header isLoggedIn={isLoggedIn} />
          <SideNavigation isLoggedIn={isLoggedIn} />
          <div className="main-content">
            <div className="container">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
