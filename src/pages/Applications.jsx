import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import StatusBadge from '../components/StatusBadge';
import styles from './Applications.module.css';

export default function Applications() {
  const { user, profile } = useAuth();
  const isOrg = profile?.role === 'organization';

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    load();
  }, [user]);

  const load = async () => {
    setLoading(true);
    const column = isOrg ? 'organization_id' : 'student_id';
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq(column, user.id)
      .order('applied_at', { ascending: false });
    if (!error) setApplications(data);
    setLoading(false);
  };

  const updateStatus = async (applicationId, status) => {
    const { data, error } = await supabase
      .from('applications')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', applicationId)
      .select()
      .single();
    if (!error) {
      setApplications((prev) => prev.map((a) => (a.id === applicationId ? data : a)));
    }
  };

  const withdraw = async (applicationId) => {
    if (!window.confirm('Withdraw this application?')) return;
    const { error } = await supabase.from('applications').delete().eq('id', applicationId);
    if (!error) setApplications((prev) => prev.filter((a) => a.id !== applicationId));
  };

  const filtered = statusFilter ? applications.filter((a) => a.status === statusFilter) : applications;

  return (
    <div className="page">
      <h1 className={styles.heading}>{isOrg ? 'Applications received' : 'My applications'}</h1>

      <div className={styles.filterRow}>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="waitlisted">Waitlisted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading && <p className={styles.empty}>Loading...</p>}
      {!loading && filtered.length === 0 && <p className={styles.empty}>No applications yet.</p>}

      <div className={styles.list}>
        {filtered.map((application) => (
          <div key={application.id} className={`card ${styles.row}`}>
            <div className={styles.info}>
              <Link to={`/internships/${application.internship_id}`} className={styles.title}>
                {application.internship_title}
              </Link>
              <p className={styles.sub}>
                {isOrg ? application.student_name : application.organization_name}
              </p>
              <p className={styles.date}>
                Applied {new Date(application.applied_at).toLocaleDateString()}
              </p>
            </div>

            <div className={styles.actions}>
              <StatusBadge status={application.status} />

              {isOrg && application.status !== 'accepted' && application.status !== 'rejected' && (
                <div className={styles.buttonGroup}>
                  <button className="btn btn-primary" onClick={() => updateStatus(application.id, 'accepted')}>Accept</button>
                  <button className="btn btn-ghost" onClick={() => updateStatus(application.id, 'waitlisted')}>Waitlist</button>
                  <button className="btn btn-danger" onClick={() => updateStatus(application.id, 'rejected')}>Reject</button>
                </div>
              )}

              {!isOrg && application.status === 'pending' && (
                <button className="btn btn-danger" onClick={() => withdraw(application.id)}>Withdraw</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
