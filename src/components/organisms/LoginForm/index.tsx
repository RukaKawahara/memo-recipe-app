import React from 'react';
import Input from '@/components/atoms/Input';
import FormField from '@/components/molecules/FormField';
import styles from './LoginForm.module.scss';
import Button from '@/components/atoms/Button';
import { login } from '@/app/(public)/login/actions';

interface LoginFormProps {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  password,
  onEmailChange,
  onPasswordChange
}) => {
  return (
    <form className={styles.loginForm}>
      <FormField
        label="メールアドレス"
      >
        <Input
          type="email"
          name="email"
          placeholder="メールアドレスを入力してください"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
        />
      </FormField>
      <FormField
        label="パスワード"
      >
        <Input
          type="password"
          name="password"
          placeholder="パスワードを入力してください"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
        />
      </FormField>
      <Button formAction={login}>ログイン</Button>
    </form>
  );
};

export default LoginForm;
