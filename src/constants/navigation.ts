export const NAVIGATION_ITEMS = [
  { href: '/',         label: 'ホーム',       iconName: 'home' as const,     visibleTo: 'all'   as const },
  { href: '/create',   label: '作成',         iconName: 'create' as const,   visibleTo: 'auth'  as const },
  { href: '/favorites',label: 'お気に入り',   iconName: 'heart' as const,    visibleTo: 'all'   as const },
  { href: '/settings', label: '設定',         iconName: 'settings' as const, visibleTo: 'auth'  as const },
  { href: '/login',    label: 'ログイン',     iconName: 'sign-in' as const,  visibleTo: 'guest' as const },
] as const;