import styles from './styles.module.scss';

interface FormContainerProps {
  children: React.ReactNode;
}

export default function FormContainer({ children }: FormContainerProps) {
  return <div className={styles.formContainer}>{children}</div>;
}