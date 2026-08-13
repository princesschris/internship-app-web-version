import React, { useState } from 'react';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { getPasswordStrength } from '../lib/passwordStrength';
import styles from './PasswordField.module.css';

export default function PasswordField({
  label,
  value,
  onChange,
  showStrength,
  placeholder,
  required,
  minLength,
  autoComplete
}) {
  const [visible, setVisible] = useState(false);
  const strength = showStrength ? getPasswordStrength(value) : null;

  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <div className={styles.inputWrap}>
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          autoComplete={autoComplete}
          className={styles.input}
        />
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
        </button>
      </div>

      {showStrength && value && (
        <div className={styles.strengthRow}>
          <div className={styles.strengthBar}>
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={`${styles.segment} ${i < strength.score ? styles[strength.level] : ''}`}
              />
            ))}
          </div>
          <span className={`${styles.strengthLabel} ${styles[strength.level]}`}>{strength.label}</span>
        </div>
      )}
    </div>
  );
}