import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import styles from './AddExperience.module.css';

export default function AddExperience() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [organizations, setOrganizations] = useState([]);
  const [loadingOrgs, setLoadingOrgs] = useState(true);
  const [search, setSearch] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentlyWorking, setCurrentlyWorking] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    setLoadingOrgs(true);
    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('id, organization_name')
      .eq('role', 'organization')
      .order('organization_name');
    if (!fetchError) setOrganizations(data);
    setLoadingOrgs(false);
  };

  const filteredOrganizations = organizations.filter((org) =>
    org.organization_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!organizationId) {
      setError('Select the organization you worked with.');
      return;
    }
    if (!currentlyWorking && !endDate) {
      setError('Add an end date, or check "I currently work here".');
      return;
    }

    const organization = organizations.find((org) => org.id === organizationId);

    setSaving(true);
    try {
      const { error: insertError } = await supabase.from('work_experiences').insert({
        student_id: user.id,
        student_name: profile.full_name,
        organization_id: organization.id,
        organization_name: organization.organization_name,
        role_title: roleTitle || null,
        start_date: startDate,
        end_date: currentlyWorking ? null : endDate
      });
      if (insertError) throw insertError;
      navigate('/profile', { state: { tab: 'teams' } });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <div className={styles.wrap}>
        <h1 className={styles.heading}>Add work experience</h1>
        <p className={styles.sub}>
          Submit the organization you worked with — they'll need to verify it before it shows as confirmed.
        </p>

        <form className={`card ${styles.form}`} onSubmit={handleSubmit}>
          {error && <p className="error-text">{error}</p>}

          <div className="field">
            <label>Search organization</label>
            <input
              placeholder="Start typing an organization name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Organization</label>
            <select value={organizationId} onChange={(e) => setOrganizationId(e.target.value)} required>
              <option value="">
                {loadingOrgs ? 'Loading organizations...' : 'Select organization'}
              </option>
              {filteredOrganizations.map((org) => (
                <option key={org.id} value={org.id}>{org.organization_name}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Role / position</label>
            <input
              placeholder="e.g. Frontend Development Intern"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
            />
          </div>

          <div className={styles.row}>
            <div className="field">
              <label>Start date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
            </div>
            <div className="field">
              <label>End date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={currentlyWorking}
                required={!currentlyWorking}
              />
            </div>
          </div>

          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={currentlyWorking}
              onChange={(e) => setCurrentlyWorking(e.target.checked)}
            />
            I currently work here
          </label>

          <button className="btn btn-primary" disabled={saving}>
            {saving ? 'Submitting...' : 'Submit for verification'}
          </button>
        </form>
      </div>
    </div>
  );
}