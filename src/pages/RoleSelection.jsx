import React from 'react';
import { Link } from 'react-router-dom';
import { IoSchoolOutline, IoBusinessOutline } from 'react-icons/io5';
import styles from './RoleSelection.module.css';

export default function RoleSelection() {
  return (
    <div className="page">
      <div className={styles.hero}>
        <h1 className={styles.headline}>Find the internship. Fill the role.</h1>
        <p className={styles.sub}>One place for students to find internships and organizations to find talent.</p>
      </div>

      <div className={styles.grid}>
        <Link to="/student/login" className={`card ${styles.option}`}>
          <IoSchoolOutline size={36} color="var(--color-primary)" />
          <h2>I'm a student</h2>
          <p>Browse internships and track your applications.</p>
        </Link>

        <Link to="/organization/login" className={`card ${styles.option}`}>
          <IoBusinessOutline size={36} color="var(--color-primary)" />
          <h2>I'm an organization</h2>
          <p>Post internships and manage applicants.</p>
        </Link>
      </div>
    </div>
  );
}
