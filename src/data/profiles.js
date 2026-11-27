// Sample profile data. Name, email and sign-up details come from the signed-in profile;
// everything else here is placeholder until real tables exist.
export const studentSample = {
  headline: 'BSc Software Engineering',
  faculty: 'Faculty of Computing',
  department: 'Software Engineering',
  level: '400 level',
  cgpa: '4.52 / 5.0',
  credits: { earned: 114, required: 120 },
  adviser: ['Dr. Ngozi Adeyemi', 'Practicum coordinator'],
  placement: { host: 'Eko Cloud Systems', where: 'Lagos · Remote', supervisor: 'Chidi Eze', role: 'Senior Platform Engineer', dates: '19 Oct 2026 to 5 Feb 2027', rating: '4.7 / 5.0', review: 'Strong progress on container orchestration. Ready for more independent work.' },
  coursework: [['CSC 301', 'Distributed Systems', 'A'], ['CSC 210', 'Data Structures', 'A-'], ['SEN 322', 'Software Architecture', 'A'], ['CSC 305', 'Computer Networks', 'B+']],
  skills: ['React', 'Node.js', 'Kubernetes', 'Terraform', 'PostgreSQL', 'Go'],
  artifacts: [['Staging cluster alerting rules', 'Nov 2026'], ['Helm chart library', 'Nov 2026']],
  preferences: [['Target roles', 'Platform engineering, backend development'], ['Work mode', 'Hybrid or remote'], ['Minimum stipend', '₦150,000 a month']],
  consents: [
    ['Share my profile with host organisations', 'Verified hosts can see your skills and coursework when you apply.', true],
    ['Let my institution read my logbook', 'Your faculty lead can read your entries for assessment.', true],
    ['Weekly progress email', 'A short summary of your hours and upcoming reviews.', false],
  ],
}

export const institutionSample = {
  name: 'Veritas University',
  about: 'Manages practicum placements, student supervision and credit approval across its faculties.',
  stats: [['Students on placement', '142'], ['Students enrolled', '1,248'], ['Partner hosts', '30'], ['Records verified', '98.6%']],
  coordinator: ['Dr. Ngozi Adeyemi', 'Practicum coordinator', 'n.adeyemi@veritas.edu.ng'],
  programmes: [['BSc Software Engineering', 240], ['BSc Computer Science', 110], ['BSc Mass Communication', 85]],
  mentors: [['Dr. Ngozi Adeyemi', 'Software Engineering'], ['Dr. Emeka Obi', 'Computer Science'], ['Prof. Halima Sani', 'Mass Communication']],
  hosts: ['Eko Cloud Systems', 'Naija Fintech Labs', 'Abuja Robotics Lab', 'Delta Analytics', 'Kano Design Studio', 'Lagos Media House'],
  policies: [
    ['Required hours', 'Every student completes 440 supervised hours.'],
    ['Weekly sign-off', 'Host supervisors sign each logbook within 7 days.'],
    ['Fair pay', 'Placements pay at least ₦100,000 a month.'],
    ['Review points', 'Mid-placement review in week 6 and final defence in week 16.'],
  ],
  matricPattern: '^VU/[A-Z]{3}/\\d{2}/\\d{4}$',
}