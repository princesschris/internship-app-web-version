import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  IoChevronBack,
  IoCameraOutline,
  IoMailOutline,
  IoLocationOutline,
  IoCallOutline,
  IoLogoGithub,
  IoLogoTwitter,
  IoLogoLinkedin,
  IoGlobeOutline
} from 'react-icons/io5';
import { useAuth } from '../contexts/AuthContext';
import styles from './Profile.module.css';

export default function Profile() {
  const { profile, profileError, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('personal');

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

  const isOrg = profile.role === 'organization';
  const displayName = isOrg ? profile.organization_name : profile.full_name;
  const location = [profile.local_government, profile.state].filter(Boolean).join(', ');

  const fields = [
    { icon: IoMailOutline, label: 'Email', value: profile.email },
    ...(isOrg ? [{ icon: IoCallOutline, label: 'Phone', value: profile.primary_phone }] : []),
    { icon: IoLocationOutline, label: 'Location', value: location },
    { icon: IoLogoGithub, label: 'GitHub', value: profile.github_url, isLink: true },
    { icon: IoLogoTwitter, label: 'Twitter / X', value: profile.twitter_url, isLink: true },
    { icon: IoLogoLinkedin, label: 'LinkedIn', value: profile.linkedin_url, isLink: true },
    { icon: IoGlobeOutline, label: 'Website', value: profile.website_url, isLink: true }
  ];

  return (
    <div className="page">
      <div className={`card ${styles.container}`}>
        <div className={styles.topBar}>
          <button className={styles.backBtn} onClick={() => navigate(-1)} aria-label="Go back">
            <IoChevronBack size={22} />
          </button>
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
          <div className={styles.teamsPlaceholder}>
            <p>Nothing here yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}