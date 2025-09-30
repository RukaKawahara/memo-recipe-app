import { InputHTMLAttributes } from 'react';
import Input from '@/components/atoms/Input';
import Icon from '@/components/atoms/Icon';
import styles from './SearchBox.module.scss';

export interface SearchBoxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const SearchBox = ({
  label,
  className = '',
  ...props
}: SearchBoxProps) => {
  return (
    <label className={`${styles.searchBox} ${className}`.trim()}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.inputWrapper}>
        <Icon name="search" size={20} className={styles.searchIcon} />
        <Input
          type="text"
          variant="search"
          className={styles.input}
          {...props}
        />
      </div>
    </label>
  );
};

export default SearchBox;
