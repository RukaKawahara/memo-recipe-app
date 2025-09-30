'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/components/atoms/Icon';
import styles from './Header.module.scss';

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

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
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

          <button
            className={styles.hamburgerButton}
            onClick={toggleMenu}
            aria-label="メニューを開く"
          >
            <Icon name="menu" size={24} />
          </button>
        </div>
      </header>

      {isMenuOpen && <div className={styles.overlay} onClick={closeMenu} />}

      <nav className={`${styles.menu} ${isMenuOpen ? styles.menuOpen : ''}`}>
        <div className={styles.menuHeader}>
          <button
            className={styles.closeButton}
            onClick={closeMenu}
            aria-label="メニューを閉じる"
          >
            <Icon name="close" size={24} />
          </button>
        </div>

        <ul className={styles.menuList}>
          {navigationItems.map((item) => (
            <li key={item.href} className={styles.menuItem}>
              <Link
                href={item.href}
                className={`${styles.menuLink} ${pathname === item.href ? styles.active : ''}`}
                onClick={closeMenu}
              >
                <Icon name={item.iconName} size={20} />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Header;
