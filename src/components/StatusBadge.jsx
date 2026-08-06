import React from 'react';
import styles from './StatusBadge.module.css';

const LABELS = {
  pending: 'Pending',
  accepted: 'Accepted',
  rejected: 'Rejected',
  waitlisted: 'Waitlisted',
  active: 'Active',
  closed: 'Closed',
  verified: 'Verified'
};

export default function StatusBadge({ status }) {
  return <span className={`${styles.badge} ${styles[status] || ''}`}>{LABELS[status] || status}</span>;
}