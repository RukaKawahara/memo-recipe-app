import React from 'react'
import styles from './Textarea.module.scss'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default'
  error?: boolean
}

const Textarea: React.FC<TextareaProps> = ({
  className,
  variant = 'default',
  error = false,
  ...props
}) => {
  return (
    <textarea
      className={`${styles.textarea} ${styles[variant]} ${error ? styles.error : ''} ${className || ''}`}
      {...props}
    />
  )
}

export default Textarea