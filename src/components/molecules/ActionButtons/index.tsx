import Link from 'next/link'
import Button from '@/components/atoms/Button'
import styles from './index.module.scss'

interface ActionButtonsProps {
  editHref: string
  onDelete: () => void
}

export default function ActionButtons({ editHref, onDelete }: ActionButtonsProps) {
  return (
    <div className={styles.container}>
      <Link href={editHref} className={styles.editButton}>
        編集
      </Link>
      <button onClick={onDelete} className={styles.deleteButton}>
        削除
      </button>
    </div>
  )
}