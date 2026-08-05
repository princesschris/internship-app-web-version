import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  IoMenuOutline,
  IoCloseOutline,
  IoBriefcaseOutline,
  IoAddCircleOutline,
  IoDocumentTextOutline,
  IoPersonCircleOutline,
  IoLogOutOutline
} from 'react-icons/io5';
import { useAuth } from '../contexts/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
    navigate('/');
  };

  const isOrg = profile?.role === 'organization';

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <Link to="/internships" className={styles.brand}>
          InternLink
        </Link>

        <nav className={`${styles.links} ${open ? styles.linksOpen : ''}`}>
          <Link to="/internships" onClick={() => setOpen(false)} className={styles.link}>
            <IoBriefcaseOutline size={18} />
            Browse
          </Link>

          {user && isOrg && (
            <>
              <Link to="/internships/new" onClick={() => setOpen(false)} className={styles.link}>
                <IoAddCircleOutline size={18} />
                Post internship
              </Link>
              <Link to="/applications" onClick={() => setOpen(false)} className={styles.link}>
                <IoDocumentTextOutline size={18} />
                Applications
              </Link>
            </>
          )}

          {user && !isOrg && (
            <Link to="/applications" onClick={() => setOpen(false)} className={styles.link}>
              <IoDocumentTextOutline size={18} />
              My applications
            </Link>
          )}

          {user && (
            <Link to="/profile" onClick={() => setOpen(false)} className={styles.link}>
              <IoPersonCircleOutline size={18} />
              Profile
            </Link>
          )}

          {user ? (
            <button className={styles.signOut} onClick={handleSignOut}>
              <IoLogOutOutline size={18} />
              Sign out
            </button>
          ) : (
            <Link to="/" onClick={() => setOpen(false)} className={`btn btn-primary ${styles.cta}`}>
              Sign in
            </Link>
          )}
        </nav>

        <button className={styles.menuBtn} onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <IoCloseOutline size={26} /> : <IoMenuOutline size={26} />}
        </button>
      </div>
    </header>
  );
}
