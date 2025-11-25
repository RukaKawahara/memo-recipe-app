import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
	// 期限切れの認証トークンをリフレッシュ
  return await updateSession(request)
}

// どのパスでミドルウェアを実行するかを設定
export const config = {
  matcher: [
    // アプリケーション全体でセッションをチェックしたいパスを含める
    '/',
    '/create',
    '/auth/:path*',
    '/recipes/:path*',
  ],
};