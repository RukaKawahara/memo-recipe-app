import { ReactNode, ButtonHTMLAttributes } from 'react'
import styles from './Button.module.scss'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon'
  size?: 'small' | 'medium' | 'large'
  children: ReactNode
}

export const Button = ({
  variant = 'primary',
  size = 'medium',
  className = '',
  children,
  ...props
}: ButtonProps) => {
  const classNames = `${styles.button} ${styles[variant]} ${styles[size]} ${className}`.trim()

  return (
    <button className={classNames} {...props}>
      {children}
    </button>
  )
}

export default Button