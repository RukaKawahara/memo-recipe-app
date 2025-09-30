import { useState, useEffect } from 'react';
import Button from '@/components/atoms/Button';
import Icon from '@/components/atoms/Icon';
import styles from './Pagination.module.scss';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  className?: string;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  startIndex,
  endIndex,
  totalItems,
  className = '',
}: PaginationProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5; // SP表示を考慮した最大表示数

    if (totalPages <= maxVisible + 2) {
      // 総ページ数が少ない場合は全て表示
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 最初のページは常に表示
      pages.push(1);

      if (currentPage <= 3) {
        // 現在のページが前半の場合
        for (let i = 2; i <= Math.min(maxVisible, totalPages - 1); i++) {
          pages.push(i);
        }
        pages.push('...');
      } else if (currentPage >= totalPages - 2) {
        // 現在のページが後半の場合
        pages.push('...');
        for (let i = totalPages - maxVisible + 1; i < totalPages; i++) {
          pages.push(i);
        }
      } else {
        // 現在のページが中間の場合
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
      }

      // 最後のページは常に表示
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();
  const buttonSize = isMobile ? 'small' : 'medium';

  return (
    <div className={`${styles.paginationContainer} ${className}`.trim()}>
      <div className={styles.pagination}>
        <Button
          variant="secondary"
          size={buttonSize}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={styles.paginationButton}
        >
          <Icon name="chevron-left" size={16} />
          <span className={styles.buttonText}>前へ</span>
        </Button>

        <div className={styles.pageNumbers}>
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                  ...
                </span>
              );
            }
            return (
              <Button
                key={page}
                variant={currentPage === page ? 'primary' : 'secondary'}
                size={buttonSize}
                onClick={() => onPageChange(page as number)}
                className={styles.pageNumber}
              >
                {page}
              </Button>
            );
          })}
        </div>

        <Button
          variant="secondary"
          size={buttonSize}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={styles.paginationButton}
        >
          <span className={styles.buttonText}>次へ</span>
          <Icon name="chevron-right" size={16} />
        </Button>
      </div>

      <div className={styles.paginationInfo}>
        {totalItems}件中 {startIndex + 1}-{Math.min(endIndex, totalItems)}
        件を表示
      </div>
    </div>
  );
};

export default Pagination;
