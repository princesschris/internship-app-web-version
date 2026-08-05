import React from 'react';
import { IoMailOutline } from 'react-icons/io5';
import styles from './CheckEmailNotice.module.css';

export default function CheckEmailNotice({ email }) {
  return (
    <div className={`card ${styles.card}`}>
      <IoMailOutline size={40} color="var(--color-primary)" />
      <h2 className={styles.title}>Check your email</h2>
      <p className={styles.text}>
        We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then log in.
      </p>
    </div>
  );
}