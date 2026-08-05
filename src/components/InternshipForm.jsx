import React, { useState } from 'react';
import styles from './InternshipForm.module.css';

const TYPE_OPTIONS = ['Remote', 'On-site', 'Hybrid', 'Part-time', 'Full-time', 'Paid', 'Unpaid'];

export default function InternshipForm({ initialValues, onSubmit, submitLabel }) {
  const [form, setForm] = useState({
    title: initialValues?.title || '',
    description: initialValues?.description || '',
    requirements: initialValues?.requirements || '',
    duration: initialValues?.duration || '',
    state: initialValues?.state || '',
    localGovernment: initialValues?.local_government || '',
    types: initialValues?.types || [],
    startDate: initialValues?.start_date || '',
    applicationDeadline: initialValues?.application_deadline || ''
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const toggleType = (type) => {
    setForm((prev) => ({
      ...prev,
      types: prev.types.includes(type) ? prev.types.filter((t) => t !== type) : [...prev.types, type]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.types.length === 0) {
      setError('Select at least one internship type.');
      return;
    }
    setSaving(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className={`card ${styles.form}`} onSubmit={handleSubmit}>
      {error && <p className="error-text">{error}</p>}

      <div className="field">
        <label>Title</label>
        <input value={form.title} onChange={update('title')} required />
      </div>

      <div className="field">
        <label>Description</label>
        <textarea rows={5} value={form.description} onChange={update('description')} required />
      </div>

      <div className="field">
        <label>Requirements</label>
        <textarea rows={3} value={form.requirements} onChange={update('requirements')} />
      </div>

      <div className={styles.row}>
        <div className="field">
          <label>State</label>
          <input value={form.state} onChange={update('state')} required />
        </div>
        <div className="field">
          <label>Local government</label>
          <input value={form.localGovernment} onChange={update('localGovernment')} required />
        </div>
      </div>

      <div className={styles.row}>
        <div className="field">
          <label>Duration</label>
          <input placeholder="e.g. 3 months" value={form.duration} onChange={update('duration')} />
        </div>
        <div className="field">
          <label>Start date</label>
          <input type="date" value={form.startDate} onChange={update('startDate')} />
        </div>
      </div>

      <div className="field">
        <label>Application deadline</label>
        <input type="date" value={form.applicationDeadline} onChange={update('applicationDeadline')} />
      </div>

      <div className="field">
        <label>Type</label>
        <div className={styles.types}>
          {TYPE_OPTIONS.map((type) => (
            <button
              type="button"
              key={type}
              onClick={() => toggleType(type)}
              className={`${styles.typeChip} ${form.types.includes(type) ? styles.typeChipActive : ''}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <button className="btn btn-primary" disabled={saving}>
        {saving ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
