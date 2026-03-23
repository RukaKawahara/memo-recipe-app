import Link from 'next/link';
import styles from './not-found.module.scss';

export default function NotFound() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>ページが見つかりません</h1>
        <p className={styles.description}>
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <Link href="/" className={styles.link}>
          ホームに戻る
        </Link>
      </div>
    </main>
  );
}
