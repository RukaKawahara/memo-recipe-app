import { InputHTMLAttributes, forwardRef } from 'react';
import styles from './Input.module.scss';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'primary' | 'search';
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = 'primary', error = false, className = '', ...props }, ref) => {
    const classNames =
      `${styles.input} ${styles[variant]} ${error ? styles.error : ''} ${className}`.trim();

    return <input ref={ref} className={classNames} {...props} />;
  }
);

Input.displayName = 'Input';

export default Input;
