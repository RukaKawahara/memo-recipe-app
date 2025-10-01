'use client';

import { usePathname } from 'next/navigation';
import NavigationItem from '@/components/molecules/NavigationItem';
import { NAVIGATION_ITEMS } from '@/constants/navigation';
import styles from './BottomNavigation.module.scss';

export const BottomNavigation = () => {
  const pathname = usePathname();

  return (
    <nav className={styles.bottomNav}>
      {NAVIGATION_ITEMS.map((item) => (
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
