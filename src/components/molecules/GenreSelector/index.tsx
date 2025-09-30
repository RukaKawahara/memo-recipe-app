import { SelectHTMLAttributes } from 'react';
import Select from '@/components/atoms/Select';
import Icon from '@/components/atoms/Icon';
import styles from './GenreSelector.module.scss';

export interface GenreSelectorProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export const GenreSelector = ({
  label,
  options,
  className = '',
  ...props
}: GenreSelectorProps) => {
  return (
    <div className={`${styles.genreSelector} ${className}`.trim()}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.selectWrapper}>
        <Select {...props}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Icon name="chevron-down" size={16} className={styles.selectIcon} />
      </div>
    </div>
  );
};

export default GenreSelector;
