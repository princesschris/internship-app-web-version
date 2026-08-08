import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import LocationSelect from '../components/LocationSelect';
import LocationPicker from '../components/LocationPicker';
import { STATE_COORDINATES } from '../data/nigeriaStateCoordinates';
import styles from './EditProfile.module.css';

export default function EditProfile() {
  const { user, profile, updateProfile } = useAuth();
  const navigate = useNavigate();
  const isOrg = profile.role === 'organization';

  const [form, setForm] = useState({
    firstName: profile.first_name || '',
    lastName: profile.last_name || '',
    organizationName: profile.organization_name || '',
    primaryPhone: profile.primary_phone || '',
    secondaryPhone: profile.secondary_phone || '',
    state: profile.state || '',
    localGovernment: profile.local_government || '',
    address: profile.address || '',
    avatarUrl: profile.avatar_url || '',
    githubUrl: profile.github_url || '',
    twitterUrl: profile.twitter_url || '',
    linkedinUrl: profile.linkedin_url || '',
    websiteUrl: profile.website_url || '',
    latitude: profile.latitude ?? null,
    longitude: profile.longitude ?? null
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const displayName = isOrg ? form.organizationName : `${form.firstName} ${form.lastName}`.trim();

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError('');
    setUploadingAvatar(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      setForm((prev) => ({ ...prev, avatarUrl: `${data.publicUrl}?t=${Date.now()}` }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const commonFields = {
        avatar_url: form.avatarUrl || null,
        github_url: form.githubUrl || null,
        twitter_url: form.twitterUrl || null,
        linkedin_url: form.linkedinUrl || null,
        website_url: form.websiteUrl || null,
        state: form.state,
        local_government: form.localGovernment,
        address: form.address || null,
        latitude: form.latitude,
        longitude: form.longitude
      };

      if (isOrg) {
        await updateProfile({
          ...commonFields,
          organization_name: form.organizationName,
          primary_phone: form.primaryPhone,
          secondary_phone: form.secondaryPhone
        });
      } else {
        await updateProfile({
          ...commonFields,
          first_name: form.firstName,
          last_name: form.lastName,
          full_name: `${form.firstName} ${form.lastName}`.trim()
        });
      }
      navigate('/profile');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <div className={styles.wrap}>
        <h1 className={styles.heading}>Edit profile</h1>

        <form className={`card ${styles.form}`} onSubmit={handleSubmit}>
          {error && <p className="error-text">{error}</p>}

          <div className={styles.avatarSection}>
            {form.avatarUrl ? (
              <img src={form.avatarUrl} alt="Avatar" className={styles.avatarPreview} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {(displayName || '?').charAt(0).toUpperCase()}
              </div>
            )}
            <label className={styles.avatarButton}>
              {uploadingAvatar ? 'Uploading...' : 'Change photo'}
              <input type="file" accept="image/*" onChange={handleAvatarChange} disabled={uploadingAvatar} hidden />
            </label>
          </div>

          {isOrg ? (
            <>
              <div className="field">
                <label>Organization name</label>
                <input value={form.organizationName} onChange={update('organizationName')} required />
              </div>
              <div className={styles.row}>
                <div className="field">
                  <label>Primary phone</label>
                  <input value={form.primaryPhone} onChange={update('primaryPhone')} required />
                </div>
                <div className="field">
                  <label>Secondary phone</label>
                  <input value={form.secondaryPhone} onChange={update('secondaryPhone')} />
                </div>
              </div>
            </>
          ) : (
            <div className={styles.row}>
              <div className="field">
                <label>First name</label>
                <input value={form.firstName} onChange={update('firstName')} required />
              </div>
              <div className="field">
                <label>Last name</label>
                <input value={form.lastName} onChange={update('lastName')} required />
              </div>
            </div>
          )}

          <div className="field">
            <label>Address</label>
            <input
              placeholder="Street address, building name, etc."
              value={form.address}
              onChange={update('address')}
            />
          </div>

          <LocationSelect
            state={form.state}
            localGovernment={form.localGovernment}
            onStateChange={(value) => setForm({ ...form, state: value, localGovernment: '' })}
            onLocalGovernmentChange={(value) => setForm({ ...form, localGovernment: value })}
            required={false}
          />

          {isOrg && (
            <div className="field">
              <label>Exact location on map</label>
              <LocationPicker
                latitude={form.latitude}
                longitude={form.longitude}
                defaultCenter={form.state ? STATE_COORDINATES[form.state] : null}
                onChange={({ lat, lng }) => setForm({ ...form, latitude: lat, longitude: lng })}
              />
            </div>
          )}

          <div className="field">
            <label>GitHub</label>
            <input type="url" placeholder="https://github.com/yourname" value={form.githubUrl} onChange={update('githubUrl')} />
          </div>

          <div className="field">
            <label>Twitter / X</label>
            <input type="url" placeholder="https://x.com/yourname" value={form.twitterUrl} onChange={update('twitterUrl')} />
          </div>

          <div className="field">
            <label>LinkedIn</label>
            <input type="url" placeholder="https://linkedin.com/in/yourname" value={form.linkedinUrl} onChange={update('linkedinUrl')} />
          </div>

          <div className="field">
            <label>Website</label>
            <input type="url" placeholder="https://yoursite.com" value={form.websiteUrl} onChange={update('websiteUrl')} />
          </div>

          <button className="btn btn-primary" disabled={saving || uploadingAvatar}>
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  );
}