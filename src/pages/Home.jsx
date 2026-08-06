import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  IoBriefcaseOutline,
  IoAddCircleOutline,
  IoDocumentTextOutline,
  IoSearchOutline
} from 'react-icons/io5';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import InternshipCard from '../components/InternshipCard';
import styles from './Home.module.css';

const STUDENT_STEPS = [
  { title: 'Complete your profile', desc: 'Add your state and LGA so nearby internships find you first.' },
  { title: 'Browse & apply', desc: 'Search open roles by location or type and apply in a couple of clicks.' },
  { title: 'Build a verified record', desc: 'Track your applications and get past internships confirmed by the organizations themselves.' }
];

const ORG_STEPS = [
  { title: 'Post an internship', desc: 'Describe the role, location and requirements in a few minutes.' },
  { title: 'Review applicants', desc: 'See who applied and manage each one — accept, waitlist or reject.' },
  { title: 'Verify past interns', desc: 'Confirm time spent at your organization to help students build a trusted record.' }
];

export default function Home() {
  const { profile } = useAuth();
  const isOrg = profile?.role === 'organization';
  const displayName = isOrg ? profile?.organization_name : profile?.full_name;

  const [internships, setInternships] = useState([]);
  const [loadingInternships, setLoadingInternships] = useState(true);
  const [stats, setStats] = useState({ internshipCount: 0, organizationCount: 0, stateCount: 0 });
  const [stepsRole, setStepsRole] = useState(isOrg ? 'organization' : 'student');

  useEffect(() => {
    loadInternships();
    loadStats();
  }, []);

  const loadInternships = async () => {
    setLoadingInternships(true);
    const { data, error } = await supabase
      .from('internships')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(6);
    if (!error) setInternships(data);
    setLoadingInternships(false);
  };

  const loadStats = async () => {
    const [internshipRes, organizationRes, stateRes] = await Promise.all([
      supabase.from('internships').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'organization'),
      supabase.from('internships').select('state').eq('status', 'active')
    ]);

    const stateCount = stateRes.data ? new Set(stateRes.data.map((row) => row.state)).size : 0;

    setStats({
      internshipCount: internshipRes.count || 0,
      organizationCount: organizationRes.count || 0,
      stateCount
    });
  };

  const steps = stepsRole === 'organization' ? ORG_STEPS : STUDENT_STEPS;

  return (
    <div className="page">
      <div className={styles.welcome}>
        <h1 className={styles.welcomeHeading}>Welcome back, {displayName || 'there'}</h1>
        <p className={styles.welcomeSub}>
          {isOrg ? "Here's what's happening on InternLink." : "Here's what's new for you today."}
        </p>
      </div>

      <div className={styles.quickActions}>
        {isOrg ? (
          <>
            <Link to="/internships/new" className={`card ${styles.actionCard}`}>
              <IoAddCircleOutline size={26} color="var(--color-primary)" />
              <span>Post an internship</span>
            </Link>
            <Link to="/applications" className={`card ${styles.actionCard}`}>
              <IoDocumentTextOutline size={26} color="var(--color-primary)" />
              <span>Manage applications</span>
            </Link>
          </>
        ) : (
          <>
            <Link to="/internships" className={`card ${styles.actionCard}`}>
              <IoSearchOutline size={26} color="var(--color-primary)" />
              <span>Browse internships</span>
            </Link>
            <Link to="/applications" className={`card ${styles.actionCard}`}>
              <IoDocumentTextOutline size={26} color="var(--color-primary)" />
              <span>My applications</span>
            </Link>
          </>
        )}
        <Link to="/profile" className={`card ${styles.actionCard}`}>
          <IoBriefcaseOutline size={26} color="var(--color-primary)" />
          <span>View profile</span>
        </Link>
      </div>

      <div className={styles.statsBar}>
        <div className={styles.stat}>
          <span className={styles.statNumber}>{stats.internshipCount}</span>
          <span className={styles.statLabel}>Open internships</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNumber}>{stats.organizationCount}</span>
          <span className={styles.statLabel}>Organizations</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNumber}>{stats.stateCount}</span>
          <span className={styles.statLabel}>States covered</span>
        </div>
      </div>

      <div className={styles.sectionHeader}>
        <h2>Fresh internships</h2>
        <Link to="/internships" className={styles.viewAll}>View all</Link>
      </div>

      {loadingInternships ? (
        <p className={styles.empty}>Loading...</p>
      ) : internships.length === 0 ? (
        <p className={styles.empty}>No open internships yet — check back soon.</p>
      ) : (
        <div className={styles.grid}>
          {internships.map((internship) => (
            <InternshipCard key={internship.id} internship={internship} />
          ))}
        </div>
      )}

      <div className={styles.howItWorks}>
        <div className={styles.howItWorksHeader}>
          <h2>How it works</h2>
          <div className={styles.roleToggle}>
            <button
              className={`${styles.roleToggleBtn} ${stepsRole === 'student' ? styles.roleToggleActive : ''}`}
              onClick={() => setStepsRole('student')}
            >
              For students
            </button>
            <button
              className={`${styles.roleToggleBtn} ${stepsRole === 'organization' ? styles.roleToggleActive : ''}`}
              onClick={() => setStepsRole('organization')}
            >
              For organizations
            </button>
          </div>
        </div>

        <div className={styles.stepsGrid}>
          {steps.map((step, index) => (
            <div key={step.title} className={`card ${styles.stepCard}`}>
              <span className={styles.stepNumber}>{index + 1}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}