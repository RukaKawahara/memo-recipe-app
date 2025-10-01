'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import NavigationItem from '@/components/molecules/NavigationItem';
import { NAVIGATION_ITEMS } from '@/constants/navigation';
import styles from './SideNavigation.module.scss';

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
        {NAVIGATION_ITEMS.map((item) => (
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
