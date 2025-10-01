import { ReactNode, ButtonHTMLAttributes } from 'react';
import styles from './Button.module.scss';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'danger'
    | 'icon'
    | 'text'
    | 'save'
    | 'deleteImage'
    | 'genre';
  size?: 'small' | 'medium' | 'large';
  selected?: boolean;
  rounded?: boolean;
  dashed?: boolean;
  children: ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'medium',
  selected = false,
  rounded = false,
  dashed = false,
  className = '',
  children,
  ...props
}: ButtonProps) => {
  const classNames =
    `${styles.button} ${styles[variant]} ${styles[size]} ${selected ? styles.selected : ''} ${rounded ? styles.rounded : ''} ${dashed ? styles.dashed : ''} ${className}`.trim();

  return (
    <button className={classNames} {...props}>
      {children}
    </button>
  );
};

export default Button;
