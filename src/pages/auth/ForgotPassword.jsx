import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './AuthForms.module.css';

export default function ForgotPassword() {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await sendPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className={styles.wrap}>
        <h1 className={styles.heading}>Reset your password</h1>
        <p className={styles.sub}>We will email you a reset link.</p>

        <form className={`card ${styles.form}`} onSubmit={handleSubmit}>
          {error && <p className="error-text">{error}</p>}
          {sent && <p className={styles.sub}>Check your inbox for a reset link.</p>}

          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <button className={`btn btn-primary ${styles.submit}`} disabled={loading}>
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>
      </div>
    </div>
  );
}
