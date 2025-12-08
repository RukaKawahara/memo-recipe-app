import Input from "@/components/atoms/Input";
import { login, signup } from "./actions";
import Button from "@/components/atoms/Button";
import styles from './page.module.scss';

export default function LoginPage() {
  return (
    <>
      <form className={styles.loginForm}>
        <h2>アカウント作成</h2>
        <p>すでにアカウントをお持ちですか？ <a href="/signup">サインイン</a></p>
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
              <label htmlFor="password">パスワードを再入力</label>
              <Input id="password" name="password" type="password" required />
          </div>
          <div className={styles.loginInfoWrapper}>
            <input type="checkbox" id="privacyConsent" required />
            <label htmlFor="privacyConsent">プライバシーポリシーに同意します</label>
          </div>
        </div>

        <Button formAction={login}>アカウントを作成</Button>

      </form>
    </>
  )
}