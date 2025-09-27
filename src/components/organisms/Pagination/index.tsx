import Button from '@/components/atoms/Button'
import Icon from '@/components/atoms/Icon'
import styles from './Pagination.module.scss'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  startIndex: number
  endIndex: number
  totalItems: number
  className?: string
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  startIndex,
  endIndex,
  totalItems,
  className = ''
}: PaginationProps) => {
  if (totalPages <= 1) {
    return null
  }

  return (
    <div className={`${styles.paginationContainer} ${className}`.trim()}>
      <div className={styles.pagination}>
        <Button
          variant="secondary"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={styles.paginationButton}
        >
          <Icon name="chevron-left" size={16} />
          前へ
        </Button>

        <div className={styles.pageNumbers}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? 'primary' : 'secondary'}
              onClick={() => onPageChange(page)}
              className={styles.pageNumber}
            >
              {page}
            </Button>
          ))}
        </div>

        <Button
          variant="secondary"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={styles.paginationButton}
        >
          次へ
          <Icon name="chevron-right" size={16} />
        </Button>
      </div>

      <div className={styles.paginationInfo}>
        {totalItems}件中 {startIndex + 1}-{Math.min(endIndex, totalItems)}件を表示
      </div>
    </div>
  )
}

export default Pagination