import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './EditProfile.module.css';

export default function EditProfile() {
  const { profile, updateProfile } = useAuth();
  const navigate = useNavigate();
  const isOrg = profile.role === 'organization';

  const [form, setForm] = useState({
    firstName: profile.first_name || '',
    lastName: profile.last_name || '',
    organizationName: profile.organization_name || '',
    primaryPhone: profile.primary_phone || '',
    secondaryPhone: profile.secondary_phone || '',
    state: profile.state || '',
    localGovernment: profile.local_government || ''
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (isOrg) {
        await updateProfile({
          organization_name: form.organizationName,
          primary_phone: form.primaryPhone,
          secondary_phone: form.secondaryPhone,
          state: form.state,
          local_government: form.localGovernment
        });
      } else {
        await updateProfile({
          first_name: form.firstName,
          last_name: form.lastName,
          full_name: `${form.firstName} ${form.lastName}`.trim(),
          state: form.state,
          local_government: form.localGovernment
        });
      }
      navigate('/profile');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <div className={styles.wrap}>
        <h1 className={styles.heading}>Edit profile</h1>

        <form className={`card ${styles.form}`} onSubmit={handleSubmit}>
          {error && <p className="error-text">{error}</p>}

          {isOrg ? (
            <>
              <div className="field">
                <label>Organization name</label>
                <input value={form.organizationName} onChange={update('organizationName')} required />
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
            </>
          ) : (
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
          )}

          <div className={styles.row}>
            <div className="field">
              <label>State</label>
              <input value={form.state} onChange={update('state')} />
            </div>
            <div className="field">
              <label>Local government</label>
              <input value={form.localGovernment} onChange={update('localGovernment')} />
            </div>
          </div>

          <button className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
