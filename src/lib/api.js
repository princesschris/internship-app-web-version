import { supabase } from './supabase'

// Turns a database row into the shape the screens use.
const shape = (r) => ({
  id: r.id,
  organisation: r.organisation_name,
  title: r.title,
  location: r.location,
  mode: r.mode,
  stipend: r.stipend,
  match: r.match_score ?? 0,
  openings: r.openings,
  deadline: r.deadline,
  category: r.category,
  skills: r.skills || [],
  summary: r.summary,
  description: r.description,
  responsibilities: r.responsibilities || [],
  departments: r.target_departments || [],
  image: r.image_url,
})

const check = ({ data, error }) => {
  if (error) throw error
  return data
}

export async function listInternships() {
  const rows = check(await supabase.from('internships_for_me').select('*').order('match_score', { ascending: false }))
  return rows.map(shape)
}

export async function getInternship(id) {
  const row = check(await supabase.from('internships_for_me').select('*').eq('id', id).maybeSingle())
  return row ? shape(row) : null
}

export async function myApplication(internshipId) {
  return check(await supabase.from('applications').select('status, created_at').eq('internship_id', internshipId).maybeSingle())
}

export async function applyToInternship(internshipId, studentId, statement) {
  check(await supabase.from('applications').insert({ internship_id: internshipId, student_id: studentId, statement: statement || null }))
}

export async function myApplicationCounts() {
  const rows = check(await supabase.from('applications').select('status'))
  const n = (s) => rows.filter((r) => r.status === s).length
  return { active: n('submitted'), shortlisted: n('shortlisted'), offers: n('offered') }
}

export async function isSaved(internshipId) {
  const row = check(await supabase.from('saved_internships').select('internship_id').eq('internship_id', internshipId).maybeSingle())
  return !!row
}

export async function setSaved(internshipId, studentId, saved) {
  if (saved) check(await supabase.from('saved_internships').insert({ student_id: studentId, internship_id: internshipId }))
  else check(await supabase.from('saved_internships').delete().eq('internship_id', internshipId).eq('student_id', studentId))
}

export async function getInstitution(id) {
  return check(await supabase.from('institutions').select('id, name, email_domain, matric_pattern, settings').eq('id', id).maybeSingle())
}

// An update blocked by the access rules changes zero rows without an error, so we check for that.
export async function saveInstitution(id, { matric_pattern, email_domain, settings }) {
  const rows = check(await supabase.from('institutions').update({ matric_pattern, email_domain, settings }).eq('id', id).select('id'))
  if (!rows.length) throw new Error('Your changes were not saved. Only verified institution admins can change these settings.')
}

// ---------- Attendance and logbook ----------
export async function myActivePlacement() {
  const rows = check(await supabase.from('placements')
    .select('id, target_hours, start_date, end_date, organisation:organisations(name, city), host:profiles!placements_host_supervisor_id_fkey(full_name)')
    .eq('status', 'active').order('created_at', { ascending: false }).limit(1))
  return rows[0] || null
}

export async function attendanceFor(placementId) {
  return check(await supabase.from('attendance_records').select('*').eq('placement_id', placementId).order('work_date', { ascending: false }))
}

export async function logbookFor(placementId) {
  return check(await supabase.from('logbook_entries').select('*').eq('placement_id', placementId).order('entry_date', { ascending: false }))
}

export async function checkIn(placementId, lat, lng) {
  return check(await supabase.rpc('check_in', { p_placement: placementId, p_lat: lat, p_lng: lng }))
}

export async function checkOut(placementId, lat, lng, breakMinutes) {
  return check(await supabase.rpc('check_out', { p_placement: placementId, p_lat: lat, p_lng: lng, p_break: breakMinutes }))
}

// Saves today's entry as a draft, and sends it for sign-off when `submit` is true.
export async function saveLogbook({ placementId, studentId, date, existing, summary, competencies, tags, submit }) {
  let id = existing?.id
  if (id) {
    const rows = check(await supabase.from('logbook_entries').update({ summary, competencies, tags, status: 'draft' }).eq('id', id).select('id'))
    if (!rows.length) throw new Error('This entry can no longer be edited.')
  } else {
    id = check(await supabase.from('logbook_entries').insert({ placement_id: placementId, student_id: studentId, entry_date: date, summary, competencies, tags }).select('id').single()).id
  }
  if (submit) check(await supabase.from('logbook_entries').update({ status: 'submitted' }).eq('id', id))
}