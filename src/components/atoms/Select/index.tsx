import { SelectHTMLAttributes, ReactNode, forwardRef } from 'react';
import styles from './Select.module.scss';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
  error?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ error = false, className = '', children, ...props }, ref) => {
    const classNames =
      `${styles.select} ${error ? styles.error : ''} ${className}`.trim();

    return (
      <select ref={ref} className={classNames} {...props}>
        {children}
      </select>
    );
  }
);

Select.displayName = 'Select';

export default Select;
