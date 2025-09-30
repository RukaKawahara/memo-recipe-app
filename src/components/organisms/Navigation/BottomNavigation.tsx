'use client';

import { usePathname } from 'next/navigation';
import NavigationItem from '@/components/molecules/NavigationItem';
import styles from './BottomNavigation.module.scss';

const navigationItems = [
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
];

export const BottomNavigation = () => {
  const pathname = usePathname();

  return (
    <nav className={styles.bottomNav}>
      {navigationItems.map((item) => (
        <NavigationItem
          key={item.href}
          href={item.href}
          label={item.label}
          iconName={item.iconName}
          isActive={pathname === item.href}
          variant="bottom"
        />
      ))}
    </nav>
  );
};

export default BottomNavigation;
