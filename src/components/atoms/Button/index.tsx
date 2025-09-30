import { ReactNode, ButtonHTMLAttributes } from 'react';
import styles from './Button.module.scss';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'icon'
    | 'save'
    | 'delete'
    | 'genre'
    | 'deleteImage'
    | 'edit'
    | 'delete'
    | 'saveCompact'
    | 'cancel'
    | 'addDashed';
  size?: 'small' | 'medium' | 'large';
  selected?: boolean;
  children: ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'medium',
  selected = false,
  className = '',
  children,
  ...props
}: ButtonProps) => {
  const classNames =
    `${styles.button} ${styles[variant]} ${styles[size]} ${selected ? styles.selected : ''} ${className}`.trim();

  return (
    <button className={classNames} {...props}>
      {children}
    </button>
  );
};

export default Button;
