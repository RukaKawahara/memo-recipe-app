export const NAVIGATION_ITEMS = [
  {
    href: '/',
    label: 'ホーム',
    iconName: 'home' as const,
  },
  {
    href: '/create',
    label: '作成',
    iconName: 'create' as const,
  },
  {
    href: '/favorites',
    label: 'お気に入り',
    iconName: 'heart' as const,
  },
  {
    href: '/settings',
    label: '設定',
    iconName: 'settings' as const,
  },
] as const;

export type NavigationItem = (typeof NAVIGATION_ITEMS)[number];
