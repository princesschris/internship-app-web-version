import React from 'react';
import { NIGERIA_STATES, LGAS_BY_STATE } from '../data/nigeriaLocations';
import styles from './LocationSelect.module.css';

export default function LocationSelect({ state, localGovernment, onStateChange, onLocalGovernmentChange, required = true }) {
  const lgas = state ? LGAS_BY_STATE[state] || [] : [];

  return (
    <div className={styles.row}>
      <div className="field">
        <label>State</label>
        <select value={state} onChange={(e) => onStateChange(e.target.value)} required={required}>
          <option value="">Select state</option>
          {NIGERIA_STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Local government</label>
        <select
          value={localGovernment}
          onChange={(e) => onLocalGovernmentChange(e.target.value)}
          required={required}
          disabled={!state}
        >
          <option value="">{state ? 'Select LGA' : 'Select state first'}</option>
          {lgas.map((lga) => (
            <option key={lga} value={lga}>{lga}</option>
          ))}
        </select>
      </div>
    </div>
  );
}