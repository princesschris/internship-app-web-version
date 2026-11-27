export const roles = [
  { id: 'student', label: 'Student', title: 'University student', desc: 'Find verified internships, log your attendance and track your practicum progress.' },
  { id: 'organisation', label: 'Host organisation', title: 'Host organisation', desc: 'Offer internships, mentor interns and sign off their logbooks.' },
  { id: 'institution', label: 'Institution', title: 'Institution or faculty', desc: 'Verify students, supervise placements and approve practicum credit.' },
]

export const signupFields = {
  student: [
    { name: 'fullName', label: 'Full name', placeholder: 'Amara Okafor' },
    { name: 'email', label: 'Institutional email', type: 'email', placeholder: 'amara.okafor@student.veritas.edu.ng' },
    { name: 'university', label: 'University', placeholder: 'Veritas University' },
    { name: 'matric', label: 'Matriculation number', placeholder: 'VU/SEN/22/4409' },
    { name: 'course', label: 'Course of study', placeholder: 'Software Engineering' },
  ],
  organisation: [
    { name: 'fullName', label: 'Contact person', placeholder: 'Chidi Eze' },
    { name: 'email', label: 'Work email', type: 'email', placeholder: 'chidi@ekocloud.com.ng' },
    { name: 'orgName', label: 'Organisation name', placeholder: 'Eko Cloud Systems' },
    { name: 'cac', label: 'CAC registration number', placeholder: 'RC 1234567' },
    { name: 'industry', label: 'Industry', placeholder: 'Software and cloud services' },
  ],
  institution: [
    { name: 'fullName', label: 'Full name', placeholder: 'Dr. Ngozi Adeyemi' },
    { name: 'email', label: 'Official email', type: 'email', placeholder: 'n.adeyemi@veritas.edu.ng' },
    { name: 'instName', label: 'Institution name', placeholder: 'Veritas University' },
    { name: 'instRole', label: 'Your role', options: ['Institution admin', 'Department manager'] },
  ],
}