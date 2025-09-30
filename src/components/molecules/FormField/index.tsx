import React from 'react';
import FieldLabel from '@/components/atoms/FieldLabel';
import styles from './FormField.module.scss';

interface FormFieldProps {
  children: React.ReactNode;
  label?: string;
  icon?: React.ReactNode;
  required?: boolean;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  children,
  label,
  icon,
  required = false,
  className,
}) => {
  return (
    <div className={`${styles.field} ${className || ''}`}>
      {label && (
        <FieldLabel icon={icon} required={required}>
          {label}
        </FieldLabel>
      )}
      {children}
    </div>
  );
};

export default FormField;
