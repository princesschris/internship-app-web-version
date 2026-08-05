import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { IoLocationOutline, IoTimeOutline, IoCalendarOutline, IoBusinessOutline } from 'react-icons/io5';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import StatusBadge from '../components/StatusBadge';
import styles from './InternshipDetail.module.css';

export default function InternshipDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [internship, setInternship] = useState(null);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');

  const isOwner = profile?.role === 'organization' && internship?.organization_id === user?.id;
  const isStudent = profile?.role === 'student';

  useEffect(() => {
    load();
  }, [id, user]);

  const load = async () => {
    setLoading(true);
    const { data: internshipData } = await supabase
      .from('internships')
      .select('*')
      .eq('id', id)
      .single();
    setInternship(internshipData);

    if (user && internshipData) {
      const { data: applicationData } = await supabase
        .from('applications')
        .select('*')
        .eq('internship_id', id)
        .eq('student_id', user.id)
        .maybeSingle();
      setApplication(applicationData);
    }
    setLoading(false);
  };

  const handleApply = async () => {
    setError('');
    setApplying(true);
    try {
      const { data, error: applyError } = await supabase
        .from('applications')
        .insert({
          internship_id: internship.id,
          internship_title: internship.title,
          organization_id: internship.organization_id,
          organization_name: internship.organization_name,
          student_id: user.id,
          student_name: profile.full_name,
          student_email: profile.email
        })
        .select()
        .single();
      if (applyError) throw applyError;
      setApplication(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setApplying(false);
    }
  };

  const handleCloseToggle = async () => {
    const nextStatus = internship.status === 'active' ? 'closed' : 'active';
    const { data, error: updateError } = await supabase
      .from('internships')
      .update({ status: nextStatus, updated_at: new Date().toISOString() })
      .eq('id', internship.id)
      .select()
      .single();
    if (!updateError) setInternship(data);
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this internship posting?')) return;
    const { error: deleteError } = await supabase.from('internships').delete().eq('id', internship.id);
    if (!deleteError) navigate('/internships');
  };

  if (loading) return <div className="page"><p>Loading...</p></div>;
  if (!internship) return <div className="page"><p>Internship not found.</p></div>;

  return (
    <div className="page">
      <div className={`card ${styles.card}`}>
        <div className={styles.top}>
          <div>
            <h1 className={styles.title}>{internship.title}</h1>
            <p className={styles.org}>
              <IoBusinessOutline size={17} />
              {internship.organization_name}
            </p>
          </div>
          <StatusBadge status={internship.status} />
        </div>

        <div className={styles.metaGrid}>
          <span className={styles.meta}>
            <IoLocationOutline size={17} />
            {internship.local_government}, {internship.state}
          </span>
          {internship.duration && (
            <span className={styles.meta}>
              <IoTimeOutline size={17} />
              {internship.duration}
            </span>
          )}
          {internship.application_deadline && (
            <span className={styles.meta}>
              <IoCalendarOutline size={17} />
              Apply by {new Date(internship.application_deadline).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className={styles.types}>
          {(internship.types || []).map((t) => (
            <span key={t} className={styles.tag}>{t}</span>
          ))}
        </div>

        <section className={styles.section}>
          <h2>About this internship</h2>
          <p>{internship.description}</p>
        </section>

        {internship.requirements && (
          <section className={styles.section}>
            <h2>Requirements</h2>
            <p>{internship.requirements}</p>
          </section>
        )}

        {error && <p className="error-text">{error}</p>}

        <div className={styles.actions}>
          {isStudent && !application && (
            <button className="btn btn-primary" onClick={handleApply} disabled={applying || internship.status !== 'active'}>
              {applying ? 'Applying...' : internship.status === 'active' ? 'Apply now' : 'Applications closed'}
            </button>
          )}

          {isStudent && application && (
            <div className={styles.appliedRow}>
              <span>You applied</span>
              <StatusBadge status={application.status} />
            </div>
          )}

          {!user && (
            <Link to="/" className="btn btn-primary">Sign in to apply</Link>
          )}

          {isOwner && (
            <>
              <Link to={`/internships/${internship.id}/edit`} className="btn btn-ghost">Edit</Link>
              <button className="btn btn-ghost" onClick={handleCloseToggle}>
                {internship.status === 'active' ? 'Close applications' : 'Reopen'}
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
