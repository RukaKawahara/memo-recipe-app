'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import { supabase } from '@/utils/supabase/client';
import styles from './page.module.scss';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('パスワードが一致しません');
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      router.push('/');
    }
  };

  return (
    <div className={styles.container}>
      <h2>新しいパスワードを設定</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <p className={styles.error}>{error}</p>}
        <label htmlFor="password">新しいパスワード</label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label htmlFor="confirm">パスワードを再入力</label>
        <Input
          id="confirm"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        <Button type="submit">パスワードを更新</Button>
      </form>
    </div>
  );
}
