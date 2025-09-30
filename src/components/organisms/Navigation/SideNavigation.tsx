'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import NavigationItem from '@/components/molecules/NavigationItem';
import styles from './SideNavigation.module.scss';

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

export const SideNavigation = () => {
  const pathname = usePathname();

  return (
    <nav className={styles.sideNav}>
      <div className={styles.header}>
        <Link href="/" className={styles.logoLink}>
          <Image
            src="/icons/header.png"
            alt="レシピアプリ"
            width={120}
            height={40}
            className={styles.logoImage}
          />
        </Link>
      </div>
      <div className={styles.navList}>
        {navigationItems.map((item) => (
          <NavigationItem
            key={item.href}
            href={item.href}
            label={item.label}
            iconName={item.iconName}
            isActive={pathname === item.href}
            variant="side"
          />
        ))}
      </div>
    </nav>
  );
};

export default SideNavigation;
