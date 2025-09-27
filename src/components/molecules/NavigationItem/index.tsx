import Link from 'next/link'
import { ReactNode } from 'react'
import Icon from '@/components/atoms/Icon'
import styles from './NavigationItem.module.scss'

export interface NavigationItemProps {
  href: string
  label: string
  iconName: 'home' | 'create' | 'heart' | 'settings'
  isActive?: boolean
  variant?: 'bottom' | 'side'
  className?: string
}

export const NavigationItem = ({
  href,
  label,
  iconName,
  isActive = false,
  variant = 'bottom',
  className = ''
}: NavigationItemProps) => {
  const classNames = `${styles.navItem} ${styles[variant]} ${isActive ? styles.active : ''} ${className}`.trim()

  return (
    <Link href={href} className={classNames}>
      <div className={styles.icon}>
        <Icon name={iconName} size={variant === 'bottom' ? 24 : 20} />
      </div>
      <span className={styles.label}>{label}</span>
    </Link>
  )
}

export default NavigationItem