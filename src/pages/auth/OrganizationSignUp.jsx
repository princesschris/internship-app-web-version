import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LocationSelect from '../../components/LocationSelect';
import CheckEmailNotice from '../../components/CheckEmailNotice';
import styles from './AuthForms.module.css';

export default function OrganizationSignUp() {
  const { signUpOrganization } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    organizationName: '',
    email: '',
    password: '',
    primaryPhone: '',
    secondaryPhone: '',
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
      const data = await signUpOrganization(form);
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
        <h1 className={styles.heading}>Create your organization account</h1>
        <p className={styles.sub}>Post internships and manage applicants in one place.</p>

        <form className={`card ${styles.form}`} onSubmit={handleSubmit}>
          {error && <p className="error-text">{error}</p>}

          <div className="field">
            <label>Organization name</label>
            <input value={form.organizationName} onChange={update('organizationName')} required />
          </div>

          <div className="field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={update('email')} required />
          </div>

          <div className="field">
            <label>Password</label>
            <input type="password" value={form.password} onChange={update('password')} minLength={6} required />
          </div>

          <div className={styles.row}>
            <div className="field">
              <label>Primary phone</label>
              <input value={form.primaryPhone} onChange={update('primaryPhone')} required />
            </div>
            <div className="field">
              <label>Secondary phone</label>
              <input value={form.secondaryPhone} onChange={update('secondaryPhone')} />
            </div>
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
          Already have an account? <Link to="/organization/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}