import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './auth/AuthForms.module.css';

export default function ChangePassword() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await updatePassword(password);
      navigate('/profile');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className={styles.wrap}>
        <h1 className={styles.heading}>Change password</h1>

        <form className={`card ${styles.form}`} onSubmit={handleSubmit}>
          {error && <p className="error-text">{error}</p>}

          <div className="field">
            <label>New password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
          </div>

          <div className="field">
            <label>Confirm new password</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} minLength={6} required />
          </div>

          <button className={`btn btn-primary ${styles.submit}`} disabled={loading}>
            {loading ? 'Saving...' : 'Save password'}
          </button>
        </form>
      </div>
    </div>
  );
}
