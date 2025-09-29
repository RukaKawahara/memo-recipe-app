'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/atoms/Button'
import Icon from '@/components/atoms/Icon'
import styles from './Header.module.scss'

const navigationItems = [
  {
    href: '/',
    label: 'ホーム',
    iconName: 'home' as const
  },
  {
    href: '/create',
    label: '作成',
    iconName: 'create' as const
  },
  {
    href: '/favorites',
    label: 'お気に入り',
    iconName: 'heart' as const
  },
  {
    href: '/settings',
    label: '設定',
    iconName: 'settings' as const
  }
]

interface HeaderProps {
  title: string
  showAddButton?: boolean
  addButtonHref?: string
}

export const Header = ({ title, showAddButton = false, addButtonHref = '/create' }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button
            className={styles.hamburgerButton}
            onClick={toggleMenu}
            aria-label="メニューを開く"
          >
            <Icon name="menu" size={24} />
          </button>

          <h1 className={styles.title}>{title}</h1>

          {showAddButton && (
            <div className={styles.addButton}>
              <Link href={addButtonHref}>
                <Button variant="icon">
                  <Icon name="plus" size={24} />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      {isMenuOpen && (
        <div className={styles.overlay} onClick={closeMenu} />
      )}

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
  )
}

export default Header