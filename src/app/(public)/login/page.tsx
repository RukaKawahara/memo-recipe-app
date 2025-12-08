import Input from "@/components/atoms/Input";
import { login, signup } from "./actions";
import Button from "@/components/atoms/Button";

export default function LoginPage() {
  return (
    <>
      <form>
        <h2>ログイン</h2>
        <p>アカウントを作成しますか？ <a href="#">サインアップ</a></p>
        <div className="login-section">
          <label htmlFor="email">メールアドレスまたはユーザー名</label>
          <Input id="email" name="email" type="email" required />
          <label htmlFor="password">パスワード</label>
          <Input id="password" name="password" type="password" required />
        </div>

        <Button formAction={login}>ログイン</Button>
        {/* <button formAction={signup}>Sign up</button> */}

      </form>
      <form action="/auth/signout" method="post">
          <button className="button block" type="submit">
              Sign out
          </button>
      </form>
    </>
  )
}