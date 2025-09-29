import LoadingSpinner from '@/components/atoms/LoadingSpinner'
import styles from './LoadingState.module.scss'

export interface LoadingStateProps {
  title: string
  subtitle?: string
  className?: string
}

export const LoadingState = ({
  title,
  subtitle,
  className = ''
}: LoadingStateProps) => {
  return (
    <div className={`${styles.loadingContainer} ${className}`.trim()}>
      <div className={styles.loadingSpinner}>
        <LoadingSpinner size="large" />
      </div>
      <div className={styles.loadingText}>{title}</div>
      {subtitle && <div className={styles.loadingSubtext}>{subtitle}</div>}
    </div>
  )
}

export default LoadingState