import { login, signup } from "./actions";

export default function LoginPage() {
  return (
    <>
      <form>
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" required />
        <label htmlFor="password">Password:</label>
        <input id="password" name="password" type="password" required />

        {/* ✅Server Actionsでログイン、サインアップ */}
        <button formAction={login}>Log in</button>
        <button formAction={signup}>Sign up</button>

      </form>
      <form action="/auth/signout" method="post">
          <button className="button block" type="submit">
              Sign out
          </button>
      </form>
    </>
  )
}