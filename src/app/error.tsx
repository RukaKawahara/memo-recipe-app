'use client';

import { useEffect } from 'react';
import styles from './error.module.scss';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <p className={styles.code}>500</p>
        <h1 className={styles.title}>エラーが発生しました</h1>
        <p className={styles.description}>
          予期しないエラーが発生しました。しばらく経ってから再度お試しください。
        </p>
        <div className={styles.actions}>
          <button onClick={reset} className={styles.button}>
            再試行
          </button>
          <a href="/" className={styles.link}>
            ホームに戻る
          </a>
        </div>
      </div>
    </main>
  );
}
