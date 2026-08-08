import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  IoCameraOutline,
  IoMailOutline,
  IoLocationOutline,
  IoHomeOutline,
  IoCallOutline,
  IoLogoGithub,
  IoLogoTwitter,
  IoLogoLinkedin,
  IoGlobeOutline
} from 'react-icons/io5';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import StatusBadge from '../components/StatusBadge';
import { formatDateRange, formatDuration } from '../lib/duration';
import styles from './Profile.module.css';

export default function Profile() {
  const { user, profile, profileError, refreshProfile } = useAuth();
  const routerLocation = useLocation();
  const [tab, setTab] = useState(routerLocation.state?.tab || 'personal');
  const [experiences, setExperiences] = useState([]);
  const [loadingExperiences, setLoadingExperiences] = useState(true);

  const isOrg = profile?.role === 'organization';

  useEffect(() => {
    if (!user || !profile) return;
    loadExperiences();
  }, [user, profile]);

  const loadExperiences = async () => {
    setLoadingExperiences(true);
    const column = isOrg ? 'organization_id' : 'student_id';
    const { data, error } = await supabase
      .from('work_experiences')
      .select('*')
      .eq(column, user.id)
      .order('start_date', { ascending: false });
    if (!error) setExperiences(data);
    setLoadingExperiences(false);
  };

  const handleRespond = async (id, status) => {
    const { data, error } = await supabase
      .from('work_experiences')
      .update({ status, responded_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (!error) {
      setExperiences((prev) => prev.map((exp) => (exp.id === id ? data : exp)));
    }
  };

  if (!profile) {
    return (
      <div className="page">
        <div className={`card ${styles.errorCard}`}>
          <h1 className={styles.errorHeading}>We couldn't load your profile</h1>
          {profileError && <p className="error-text">{profileError}</p>}
          <button className="btn btn-primary" onClick={refreshProfile}>Try again</button>
        </div>
      </div>
    );
  }

  const displayName = isOrg ? profile.organization_name : profile.full_name;
  const locationText = [profile.local_government, profile.state].filter(Boolean).join(', ');

  const fields = [
    { icon: IoMailOutline, label: 'Email', value: profile.email },
    ...(isOrg ? [{ icon: IoCallOutline, label: 'Phone', value: profile.primary_phone }] : []),
    { icon: IoLocationOutline, label: 'Location', value: locationText },
    { icon: IoHomeOutline, label: 'Address', value: profile.address },
    { icon: IoLogoGithub, label: 'GitHub', value: profile.github_url, isLink: true },
    { icon: IoLogoTwitter, label: 'Twitter / X', value: profile.twitter_url, isLink: true },
    { icon: IoLogoLinkedin, label: 'LinkedIn', value: profile.linkedin_url, isLink: true },
    { icon: IoGlobeOutline, label: 'Website', value: profile.website_url, isLink: true }
  ];

  return (
    <div className="page">
      <div className={`card ${styles.container}`}>
        <div className={styles.topBar}>
          <h1 className={styles.pageTitle}>My Profile</h1>
          <Link to="/profile/edit" className={styles.editLink}>Edit</Link>
        </div>

        <div className={styles.identityRow}>
          <div className={styles.avatarWrap}>
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={displayName} className={styles.avatarImage} />
            ) : (
              <div className={styles.avatar}>{(displayName || '?').charAt(0).toUpperCase()}</div>
            )}
            <Link to="/profile/edit" className={styles.cameraBadge} aria-label="Change photo">
              <IoCameraOutline size={15} />
            </Link>
          </div>

          <div>
            <h2 className={styles.name}>{displayName}</h2>
            <span className={styles.roleBadge}>{isOrg ? 'Organization' : 'Student'}</span>
          </div>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === 'personal' ? styles.tabActive : ''}`}
            onClick={() => setTab('personal')}
          >
            Personal Info
          </button>
          <button
            className={`${styles.tab} ${tab === 'teams' ? styles.tabActive : ''}`}
            onClick={() => setTab('teams')}
          >
            Teams
          </button>
        </div>

        {tab === 'personal' ? (
          <div className={styles.fieldList}>
            {fields.map(({ icon: Icon, label, value, isLink }) => (
              <div key={label} className={styles.fieldRow}>
                <Icon size={19} color="var(--color-muted)" />
                <div className={styles.fieldBody}>
                  <span className={styles.fieldLabel}>{label}</span>
                  {value ? (
                    isLink ? (
                      <a href={value} target="_blank" rel="noreferrer" className={styles.fieldValue}>{value}</a>
                    ) : (
                      <span className={styles.fieldValue}>{value}</span>
                    )
                  ) : (
                    <Link to="/profile/edit" className={styles.fieldEmpty}>Add {label.toLowerCase()}</Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.teamsSection}>
            {!isOrg && (
              <Link to="/experience/new" className={`btn btn-primary ${styles.addExperienceBtn}`}>
                Add organization
              </Link>
            )}

            {loadingExperiences ? (
              <p className={styles.teamsPlaceholder}>Loading...</p>
            ) : experiences.length === 0 ? (
              <div className={styles.teamsPlaceholder}>
                <p>{isOrg ? 'No verification requests yet.' : 'No work experience added yet.'}</p>
              </div>
            ) : (
              <div className={styles.experienceList}>
                {experiences.map((exp) => (
                  <div key={exp.id} className={styles.experienceRow}>
                    <div className={styles.experienceHeader}>
                      <span className={styles.experienceTitle}>
                        {isOrg ? exp.student_name : exp.organization_name}
                      </span>
                      <StatusBadge status={exp.status} />
                    </div>
                    {exp.role_title && <p className={styles.experienceRole}>{exp.role_title}</p>}
                    <p className={styles.experienceDates}>
                      {formatDateRange(exp.start_date, exp.end_date)} · {formatDuration(exp.start_date, exp.end_date)}
                    </p>
                    {isOrg && exp.status === 'pending' && (
                      <div className={styles.experienceActions}>
                        <button className="btn btn-primary" onClick={() => handleRespond(exp.id, 'verified')}>Verify</button>
                        <button className="btn btn-danger" onClick={() => handleRespond(exp.id, 'rejected')}>Reject</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}