import { ReactNode } from 'react'
import styles from './GenreTag.module.scss'

export interface GenreTagProps {
  children: ReactNode
  variant?: 'default' | 'selected'
  size?: 'small' | 'medium'
  className?: string
  onClick?: () => void
}

export const GenreTag = ({
  children,
  variant = 'default',
  size = 'medium',
  className = '',
  onClick,
  ...props
}: GenreTagProps) => {
  const classNames = `${styles.tag} ${styles[variant]} ${styles[size]} ${className}`.trim()

  const Component = onClick ? 'button' : 'span'

  return (
    <Component
      className={classNames}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  )
}

export default GenreTag