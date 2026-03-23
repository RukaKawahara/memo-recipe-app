'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import NavigationItem from '@/components/molecules/NavigationItem';
import Icon from '@/components/atoms/Icon';
import { NAVIGATION_ITEMS } from '@/constants/navigation';
import styles from './SideNavigation.module.scss';

export const SideNavigation = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const pathname = usePathname();
  const role = isLoggedIn ? 'auth' : 'guest';
  const visibleItems = NAVIGATION_ITEMS.filter(item => item.visibleTo === 'all' || item.visibleTo === role);

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
        {visibleItems.map((item) => (
          <NavigationItem
            key={item.href}
            href={item.href}
            label={item.label}
            iconName={item.iconName}
            isActive={pathname === item.href}
            variant="side"
          />
        ))}
        {isLoggedIn && (
          <form action="/auth/logout" method="post">
            <button type="submit" className={styles.logoutButton}>
              <Icon name="sign-out" size={20} />
              <span>ログアウト</span>
            </button>
          </form>
        )}
      </div>
    </nav>
  );
};

export default SideNavigation;
