'use client';

import { useState } from 'react';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import { supabase } from '@/utils/supabase/client';
import styles from './page.module.scss';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className={styles.container}>
        <h2>メールを送信しました</h2>
        <p>パスワードリセット用のリンクを <strong>{email}</strong> に送りました。メールをご確認ください。</p>
        <a href="/login">ログイン画面に戻る</a>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2>パスワードをお忘れですか？</h2>
      <p>登録済みのメールアドレスを入力してください。パスワードリセット用のリンクをお送りします。</p>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <p className={styles.error}>{error}</p>}
        <label htmlFor="email">メールアドレス</label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit">リセットメールを送信</Button>
      </form>
      <a href="/login">ログイン画面に戻る</a>
    </div>
  );
}
