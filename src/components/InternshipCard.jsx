import React from 'react';
import { Link } from 'react-router-dom';
import { IoLocationOutline, IoTimeOutline, IoBusinessOutline } from 'react-icons/io5';
import StatusBadge from './StatusBadge';
import styles from './InternshipCard.module.css';

export default function InternshipCard({ internship }) {
  return (
    <Link to={`/internships/${internship.id}`} className={`card ${styles.card}`}>
      <div className={styles.top}>
        <h3 className={styles.title}>{internship.title}</h3>
        <StatusBadge status={internship.status} />
      </div>

      <p className={styles.org}>
        <IoBusinessOutline size={16} />
        {internship.organization_name}
      </p>

      <p className={styles.meta}>
        <IoLocationOutline size={16} />
        {internship.local_government}, {internship.state}
      </p>

      {internship.duration && (
        <p className={styles.meta}>
          <IoTimeOutline size={16} />
          {internship.duration}
        </p>
      )}

      <div className={styles.types}>
        {(internship.types || []).map((t) => (
          <span key={t} className={styles.tag}>{t}</span>
        ))}
      </div>
    </Link>
  );
}
