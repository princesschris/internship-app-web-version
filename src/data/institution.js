// Sample institution data. Replace with Supabase queries later; keep the same shapes.
export const overview = { active: 142, hours: 18420, awaiting: 8, approvals: 36 }
export const stages = [['Onboarding', 17], ['Mid-placement', 91], ['Defence preparation', 26], ['Credit awarded', 8]]
export const departments = ['Software Engineering', 'Computer Science', 'Mass Communication', 'Electrical Engineering']
export const TARGET_HOURS = 440

export const students = [
  { id: 1, name: 'Amara Okafor', email: 'amara.okafor@student.veritas.edu.ng', matric: 'VU/SEN/22/4409', dept: 'Software Engineering', host: 'Eko Cloud Systems', supervisor: 'Dr. Ngozi Adeyemi', hours: 168, attendance: 'On track', lastReview: '2026-11-20', status: 'Placed' },
  { id: 2, name: 'Tunde Bakare', email: 'tunde.bakare@student.veritas.edu.ng', matric: 'VU/CSC/22/3128', dept: 'Computer Science', host: 'Naija Fintech Labs', supervisor: 'Dr. Emeka Obi', hours: 212, attendance: 'On track', lastReview: '2026-11-18', status: 'Placed' },
  { id: 3, name: 'Zainab Musa', email: 'zainab.musa@student.veritas.edu.ng', matric: 'VU/EEE/22/2051', dept: 'Electrical Engineering', host: 'Abuja Robotics Lab', supervisor: 'Dr. Emeka Obi', hours: 96, attendance: 'Absent 3 days', lastReview: '2026-11-12', status: 'Flagged' },
  { id: 4, name: 'Ifeanyi Nwosu', email: 'ifeanyi.nwosu@student.veritas.edu.ng', matric: 'VU/SEN/22/4477', dept: 'Software Engineering', host: 'Delta Analytics', supervisor: 'Dr. Ngozi Adeyemi', hours: 240, attendance: 'On track', lastReview: '2026-11-21', status: 'Placed' },
  { id: 5, name: 'Blessing Adamu', email: 'blessing.adamu@student.veritas.edu.ng', matric: 'VU/MAC/22/1190', dept: 'Mass Communication', host: 'Kano Design Studio', supervisor: 'Prof. Halima Sani', hours: 130, attendance: 'On track', lastReview: '2026-11-17', status: 'Placed' },
  { id: 6, name: 'Chinedu Eze', email: 'chinedu.eze@student.veritas.edu.ng', matric: 'VU/CSC/22/3342', dept: 'Computer Science', host: '', supervisor: 'Dr. Emeka Obi', hours: 0, attendance: 'Not started', lastReview: '', status: 'Awaiting placement' },
  { id: 7, name: 'Fatima Bello', email: 'fatima.bello@student.veritas.edu.ng', matric: 'VU/MAC/22/1215', dept: 'Mass Communication', host: 'Lagos Media House', supervisor: 'Prof. Halima Sani', hours: 88, attendance: 'Needs attention', lastReview: '2026-11-10', status: 'Flagged' },
  { id: 8, name: 'Samuel Ojo', email: 'samuel.ojo@student.veritas.edu.ng', matric: 'VU/EEE/22/2099', dept: 'Electrical Engineering', host: 'Abuja Robotics Lab', supervisor: 'Dr. Emeka Obi', hours: 175, attendance: 'On track', lastReview: '2026-11-19', status: 'Placed' },
]

export const notices = [
  { title: 'Hours do not match', text: "Fatima Bello's logged hours differ from her supervisor's record.", level: 'Urgent' },
  { title: 'Mid-placement review tomorrow', text: 'Amara Okafor, with Chidi Eze and Dr. Ngozi Adeyemi.', level: 'Scheduled' },
  { title: 'Placement agreement signed', text: 'Delta Analytics confirmed three interns for the next cycle.', level: 'Done' },
]

export const cases = [
  {
    id: 'C-1', student: 'Fatima Bello', matric: 'VU/MAC/22/1215', host: 'Lagos Media House', priority: 'High',
    issue: 'Logged hours do not match the supervisor record', logged: 7.5, confirmed: 3.75,
    perspectives: [
      ['Student', 'Fatima Bello', 'I worked on the field recording all day and logged 7.5 hours. I stayed after the team left to finish the edit.'],
      ['Host supervisor', 'Mrs. Kemi Adebayo', 'Fatima left at about 1 PM. I can confirm 3 hours 45 minutes on site.'],
      ['Faculty', 'Prof. Halima Sani', 'The edit may have been done off-site. We need evidence before crediting the extra time.'],
    ],
    checks: [['Check-in', '9:02 AM, inside the site area'], ['Check-out', '12:47 PM, inside the site area'], ['Extra time', 'No location record after 12:47 PM']],
  },
  {
    id: 'C-2', student: 'Zainab Musa', matric: 'VU/EEE/22/2051', host: 'Abuja Robotics Lab', priority: 'Medium',
    issue: 'Absent for three days without notice', logged: 0, confirmed: 0,
    perspectives: [
      ['Host supervisor', 'Mr. Yusuf Danjuma', 'Zainab has not come in since Monday and has not replied to messages.'],
      ['Faculty', 'Dr. Emeka Obi', 'I will try to reach her today. Please hold any decision until I do.'],
    ],
    checks: [['Last check-in', 'Monday, 9:15 AM'], ['Messages sent', '2 unanswered']],
  },
  {
    id: 'C-3', student: 'Samuel Ojo', matric: 'VU/EEE/22/2099', host: 'Abuja Robotics Lab', priority: 'Low',
    issue: 'Weekly logbook not signed in time', logged: 40, confirmed: 40,
    perspectives: [['Host supervisor', 'Mr. Yusuf Danjuma', 'I was travelling and signed late. The hours are correct.']],
    checks: [['Hours', '40 logged, 40 confirmed'], ['Signed', 'Two days after the window closed']],
  },
]

export const options = [
  ['accept', 'Accept the logged hours', 'Credit all hours as the student recorded them.'],
  ['confirmed', 'Credit confirmed hours only', 'Credit only the hours the supervisor confirmed.'],
  ['return', 'Send back for correction', 'Return the entry to the student with a note.'],
]