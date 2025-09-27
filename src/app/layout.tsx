import type { Metadata } from 'next'
import '@/styles/globals.scss'
import BottomNavigation from '@/components/organisms/Navigation/BottomNavigation'
import SideNavigation from '@/components/organisms/Navigation/SideNavigation'

export const metadata: Metadata = {
  title: 'シンプルメモレシピアプリ',
  description: '美味しいレシピを簡単にメモし、複数のデバイスで同期できるアプリ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com/" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?display=swap&family=Epilogue:wght@400;500;700;900&family=Noto+Sans:wght@400;500;700;900"
        />
      </head>
      <body>
        <div className="app-container">
          <SideNavigation />
          <div className="main-content">
            <div className="container">
              {children}
            </div>
            <BottomNavigation />
          </div>
        </div>
      </body>
    </html>
  )
}