import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import styles from './page.module.scss';
import { signup } from "./actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  return (
    <>
      <form className={styles.loginForm}>
        <h2>アカウント作成</h2>
        <p>すでにアカウントをお持ちですか？ <a href="/login">サインイン</a></p>
        {error && <p style={{ color: 'red' }}>{decodeURIComponent(error)}</p>}
        <div className={styles.loginSection}>
          <div className={styles.loginInfoWrapper}>
            <label htmlFor="email">メールアドレス</label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className={styles.loginInfoWrapper}>
              <label htmlFor="password">パスワード</label>
              <Input id="password" name="password" type="password" required />
          </div>
          <div className={styles.loginInfoWrapper}>
              <label htmlFor="confirm-password">パスワードを再入力</label>
              <Input id="confirm-password" name="confirm-password" type="password" required />
          </div>
        </div>
        <Button formAction={signup}>アカウントを作成</Button>
      </form>
    </>
  )
}