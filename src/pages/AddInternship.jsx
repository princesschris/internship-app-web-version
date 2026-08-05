import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import InternshipForm from '../components/InternshipForm';

export default function AddInternship() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (form) => {
    const { data, error } = await supabase
      .from('internships')
      .insert({
        title: form.title,
        description: form.description,
        requirements: form.requirements || null,
        duration: form.duration || null,
        state: form.state,
        local_government: form.localGovernment,
        types: form.types,
        organization_id: user.id,
        organization_name: profile.organization_name,
        start_date: form.startDate || null,
        application_deadline: form.applicationDeadline || null
      })
      .select()
      .single();
    if (error) throw error;
    navigate(`/internships/${data.id}`);
  };

  return (
    <div className="page">
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>Post an internship</h1>
      <InternshipForm onSubmit={handleSubmit} submitLabel="Publish internship" />
    </div>
  );
}
