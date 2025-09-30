import Link from 'next/link';
import Button from '@/components/atoms/Button';
import styles from './index.module.scss';

interface ActionButtonsProps {
  editHref: string;
  onDelete: () => void;
}

export default function ActionButtons({
  editHref,
  onDelete,
}: ActionButtonsProps) {
  return (
    <div className={styles.container}>
      <Link href={editHref}>
        <Button variant="edit">編集</Button>
      </Link>
      <Button variant="deleteAction" onClick={onDelete}>
        削除
      </Button>
    </div>
  );
}
