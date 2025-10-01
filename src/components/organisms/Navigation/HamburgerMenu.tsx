'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/atoms/Icon';
import { NAVIGATION_ITEMS } from '@/constants/navigation';
import styles from './HamburgerMenu.module.scss';

export const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className={styles.hamburgerContainer}>
        <button
          className={styles.hamburgerButton}
          onClick={toggleMenu}
          aria-label="メニューを開く"
        >
          <Icon name="menu" size={24} />
        </button>
      </div>

      {isOpen && <div className={styles.overlay} onClick={closeMenu} />}

      <nav className={`${styles.menu} ${isOpen ? styles.menuOpen : ''}`}>
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
          {NAVIGATION_ITEMS.map((item) => (
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

export default HamburgerMenu;
