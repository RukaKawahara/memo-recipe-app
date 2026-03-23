'use client';

import LoginForm from '@/components/organisms/LoginForm';
import styles from './page.module.scss';
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className={styles.loginSection}>
      <div className={styles.loginHeading}>
        <h2>ログイン</h2>
        <p>アカウントを作成しますか？ <a href="/signup">サインアップ</a></p>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className={styles.loginFormContainer}>
        <LoginForm
          email={email}
          password={password}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
        />
      </div>
    </div>
  )
}