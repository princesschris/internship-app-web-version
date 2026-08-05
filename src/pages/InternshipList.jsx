import React, { useEffect, useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import { supabase } from '../lib/supabaseClient';
import InternshipCard from '../components/InternshipCard';
import styles from './InternshipList.module.css';

export default function InternshipList() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [state, setState] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('internships')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    if (!error) setInternships(data);
    setLoading(false);
  };

  const states = [...new Set(internships.map((i) => i.state))].sort();
  const types = [...new Set(internships.flatMap((i) => i.types || []))].sort();

  const filtered = internships.filter((i) => {
    const matchesSearch =
      !search ||
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.organization_name.toLowerCase().includes(search.toLowerCase());
    const matchesState = !state || i.state === state;
    const matchesType = !type || (i.types || []).includes(type);
    return matchesSearch && matchesState && matchesType;
  });

  return (
    <div className="page">
      <h1 className={styles.heading}>Open internships</h1>

      <div className={styles.filters}>
        <div className={styles.search}>
          <IoSearchOutline size={18} color="var(--color-muted)" />
          <input
            placeholder="Search by title or organization"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select value={state} onChange={(e) => setState(e.target.value)}>
          <option value="">All states</option>
          {states.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All types</option>
          {types.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {loading && <p className={styles.empty}>Loading internships...</p>}
      {!loading && filtered.length === 0 && <p className={styles.empty}>No internships match your filters.</p>}

      <div className={styles.grid}>
        {filtered.map((internship) => (
          <InternshipCard key={internship.id} internship={internship} />
        ))}
      </div>
    </div>
  );
}
