import styles from './styles.module.scss';

interface FormActionsProps {
  children: React.ReactNode;
}

export default function FormActions({ children }: FormActionsProps) {
  return (
    <div className={styles.actions}>
      <div className={styles.buttonsWrapper}>{children}</div>
    </div>
  );
}