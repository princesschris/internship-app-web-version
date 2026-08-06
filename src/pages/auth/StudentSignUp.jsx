import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LocationSelect from '../../components/LocationSelect';
import CheckEmailNotice from '../../components/CheckEmailNotice';
import styles from './AuthForms.module.css';

export default function StudentSignUp() {
  const { signUpStudent } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    state: '',
    localGovernment: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await signUpStudent(form);
      if (data.session) {
        navigate('/home');
      } else {
        setNeedsConfirmation(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (needsConfirmation) {
    return (
      <div className="page">
        <div className={styles.wrap}>
          <CheckEmailNotice email={form.email} />
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className={styles.wrap}>
        <h1 className={styles.heading}>Create your student account</h1>
        <p className={styles.sub}>Start applying to internships near you.</p>

        <form className={`card ${styles.form}`} onSubmit={handleSubmit}>
          {error && <p className="error-text">{error}</p>}

          <div className={styles.row}>
            <div className="field">
              <label>First name</label>
              <input value={form.firstName} onChange={update('firstName')} required />
            </div>
            <div className="field">
              <label>Last name</label>
              <input value={form.lastName} onChange={update('lastName')} required />
            </div>
          </div>

          <div className="field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={update('email')} required />
          </div>

          <div className="field">
            <label>Password</label>
            <input type="password" value={form.password} onChange={update('password')} minLength={6} required />
          </div>

          <LocationSelect
            state={form.state}
            localGovernment={form.localGovernment}
            onStateChange={(value) => setForm({ ...form, state: value, localGovernment: '' })}
            onLocalGovernmentChange={(value) => setForm({ ...form, localGovernment: value })}
          />

          <button className={`btn btn-primary ${styles.submit}`} disabled={loading}>
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account? <Link to="/student/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}