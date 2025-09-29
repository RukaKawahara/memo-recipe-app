import Link from 'next/link'
import styles from './EmptyState.module.scss'

export interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  actionText: string
  actionHref: string
  className?: string
}

export const EmptyState = ({
  icon,
  title,
  description,
  actionText,
  actionHref,
  className = ''
}: EmptyStateProps) => {
  return (
    <div className={`${styles.empty} ${className}`.trim()}>
      {icon && <div className={styles.emptyIcon}>{icon}</div>}
      <p className={styles.title}>{title}</p>
      {description && <p className={styles.description}>{description}</p>}
      <Link href={actionHref} className={styles.actionButton}>
        {actionText}
      </Link>
    </div>
  )
}

export default EmptyState