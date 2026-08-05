import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import InternshipForm from '../components/InternshipForm';

export default function EditInternship() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [id]);

  const load = async () => {
    const { data } = await supabase.from('internships').select('*').eq('id', id).single();
    setInternship(data);
    setLoading(false);
  };

  const handleSubmit = async (form) => {
    const { error } = await supabase
      .from('internships')
      .update({
        title: form.title,
        description: form.description,
        requirements: form.requirements || null,
        duration: form.duration || null,
        state: form.state,
        local_government: form.localGovernment,
        types: form.types,
        start_date: form.startDate || null,
        application_deadline: form.applicationDeadline || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    if (error) throw error;
    navigate(`/internships/${id}`);
  };

  if (loading) return <div className="page"><p>Loading...</p></div>;
  if (!internship) return <div className="page"><p>Internship not found.</p></div>;

  return (
    <div className="page">
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>Edit internship</h1>
      <InternshipForm initialValues={internship} onSubmit={handleSubmit} submitLabel="Save changes" />
    </div>
  );
}
