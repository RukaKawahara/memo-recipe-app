import styles from './LoadingSpinner.module.scss';

export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const LoadingSpinner = ({
  size = 'medium',
  className = '',
}: LoadingSpinnerProps) => {
  const classNames = `${styles.spinner} ${styles[size]} ${className}`.trim();

  return <div className={classNames} />;
};

export default LoadingSpinner;
