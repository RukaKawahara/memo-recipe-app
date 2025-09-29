import React from 'react'
import styles from './FieldLabel.module.scss'

interface FieldLabelProps {
  children: React.ReactNode
  icon?: React.ReactNode
  required?: boolean
  className?: string
}

const FieldLabel: React.FC<FieldLabelProps> = ({
  children,
  icon,
  required = false,
  className
}) => {
  return (
    <div className={`${styles.fieldLabel} ${className || ''}`}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.text}>{children}</span>
      {required && <span className={styles.required}>*</span>}
    </div>
  )
}

export default FieldLabel