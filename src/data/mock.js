// Sample data. Replace with Supabase queries later; keep the same shapes.
export const student = {
  firstName: 'Amara',
  fullName: 'Amara Okafor',
  institution: 'Veritas University',
  term: 'Harmattan term 2026',
}

export const placement = {
  organisation: 'Eko Cloud Systems',
  title: 'Junior Cloud Infrastructure Intern',
  supervisor: 'Chidi Eze',
  supervisorRole: 'Senior Platform Engineer',
  focus: 'automated container orchestration and Kubernetes monitoring',
  week: 6,
  totalWeeks: 16,
  loggedHours: 168,
  targetHours: 440,
  checkedInAt: '09:02 AM WAT',
}

export const pipeline = { active: 4, shortlisted: 2, offers: 1 }
export const attendance = { today: '5h 24m', target: '7.5h', percent: 72, breakMinutes: 45 }

export const meeting = {
  title: 'Supervisor review',
  when: 'Tomorrow, 2:00 PM WAT (45 min)',
  with: 'Dr. Ngozi Adeyemi and Chidi Eze',
}

export const advisor = {
  name: 'Dr. Ngozi Adeyemi',
  role: 'Practicum coordinator',
  note: 'Amara, your week 5 logbook was clear and well written. Let us talk about turning it into a short report.',
}

export const milestones = [
  { label: 'Safety briefing and clearance', detail: 'Verified on 14 Sep', status: 'done' },
  { label: 'Placement scope agreed', detail: 'Signed off by Chidi Eze', status: 'done' },
  { label: 'Mid-term supervisor review', detail: 'Due tomorrow', status: 'current' },
  { label: 'Final report and defence', detail: 'Due 24 Jan', status: 'upcoming' },
]

export const categories = ['All placements', 'Cloud and systems', 'Data and AI', 'Product and design', 'Energy and hardware']

export const internships = [
  { id: 1, organisation: 'Naija Fintech Labs', title: 'Software Engineering Intern', location: 'Lagos', mode: 'Hybrid', stipend: 150000, match: 98, openings: 4, deadline: '2026-12-18', category: 'Cloud and systems', skills: ['React', 'Node.js', 'PostgreSQL'], summary: 'Build and test payment dashboards used by small merchants across Lagos.' },
  { id: 2, organisation: 'Abuja Robotics Lab', title: 'Autonomous Systems Intern', location: 'Abuja', mode: 'On-site', stipend: 120000, match: 94, openings: 2, deadline: '2026-12-22', category: 'Energy and hardware', skills: ['C++', 'ROS 2', 'Linux'], summary: 'Work on sensor mapping for warehouse robots with the lab engineers.' },
  { id: 3, organisation: 'Delta Analytics', title: 'Machine Learning Fellow', location: 'Port Harcourt', mode: 'Hybrid', stipend: 180000, match: 91, openings: 3, deadline: '2027-01-10', category: 'Data and AI', skills: ['Python', 'PyTorch', 'SQL'], summary: 'Help train models that forecast fuel demand from field data.' },
  { id: 4, organisation: 'Eko Cloud Systems', title: 'Systems Architecture Associate', location: 'Lagos', mode: 'Hybrid', stipend: 160000, match: 95, openings: 3, deadline: '2026-12-30', category: 'Cloud and systems', skills: ['Go', 'Kubernetes', 'Kafka'], summary: 'Design data pipelines that process readings from thousands of meters.' },
  { id: 5, organisation: 'Kano Design Studio', title: 'Digital Product Apprentice', location: 'Kano', mode: 'Remote', stipend: 110000, match: 93, openings: 1, deadline: '2027-01-05', category: 'Product and design', skills: ['Figma', 'React', 'CSS'], summary: 'Craft interfaces for a marketplace used by traders across northern Nigeria.' },
  { id: 6, organisation: 'Aba Health Informatics', title: 'Bioinformatics Research Intern', location: 'Aba', mode: 'On-site', stipend: 130000, match: 89, openings: 2, deadline: '2027-01-15', category: 'Data and AI', skills: ['Python', 'R', 'Nextflow'], summary: 'Build reproducible analysis pipelines for clinic sample data.' },
]