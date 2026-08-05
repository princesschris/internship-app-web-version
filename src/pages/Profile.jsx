import React from 'react';
import { Link } from 'react-router-dom';
import { IoMailOutline, IoLocationOutline, IoCallOutline } from 'react-icons/io5';
import { useAuth } from '../contexts/AuthContext';
import styles from './Profile.module.css';

export default function Profile() {
  const { profile } = useAuth();
  if (!profile) return null;

  const isOrg = profile.role === 'organization';

  return (
    <div className="page">
      <div className={`card ${styles.card}`}>
        <div className={styles.avatar}>
          {(isOrg ? profile.organization_name : profile.full_name || '?').charAt(0).toUpperCase()}
        </div>

        <h1 className={styles.name}>{isOrg ? profile.organization_name : profile.full_name}</h1>
        <p className={styles.role}>{isOrg ? 'Organization' : 'Student'}</p>

        <div className={styles.details}>
          <p><IoMailOutline size={17} /> {profile.email}</p>
          {isOrg && profile.primary_phone && <p><IoCallOutline size={17} /> {profile.primary_phone}</p>}
          {(profile.state || profile.local_government) && (
            <p><IoLocationOutline size={17} /> {profile.local_government}{profile.local_government && profile.state ? ', ' : ''}{profile.state}</p>
          )}
        </div>

        <div className={styles.actions}>
          <Link to="/profile/edit" className="btn btn-primary">Edit profile</Link>
          <Link to="/change-password" className="btn btn-ghost">Change password</Link>
        </div>
      </div>
    </div>
  );
}
