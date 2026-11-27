// Sample data for Faculty and mentors, Setup and governance, and Supervision schedule.
export const mentorTabs = ['All', 'Faculty adviser', 'Industry mentor', 'External assessor']
export const mentors = [
  { id: 1, name: 'Dr. Ngozi Adeyemi', kind: 'Faculty adviser', org: 'Software Engineering', bio: 'Supervises placements in cloud and backend engineering.', assigned: 12, capacity: 15, next: 'Wed 25 Nov, 2:00 PM' },
  { id: 2, name: 'Dr. Emeka Obi', kind: 'Faculty adviser', org: 'Computer Science', bio: 'Supervises students in systems, networks and robotics.', assigned: 14, capacity: 15, next: 'Thu 26 Nov, 11:00 AM' },
  { id: 3, name: 'Prof. Halima Sani', kind: 'Faculty adviser', org: 'Mass Communication', bio: 'Supervises media and design placements.', assigned: 9, capacity: 12, next: 'Fri 27 Nov, 10:00 AM' },
  { id: 4, name: 'Chidi Eze', kind: 'Industry mentor', org: 'Eko Cloud Systems', bio: 'Senior platform engineer who mentors interns on live infrastructure.', assigned: 3, capacity: 4, next: 'Wed 25 Nov, 2:00 PM' },
  { id: 5, name: 'Yusuf Danjuma', kind: 'Industry mentor', org: 'Abuja Robotics Lab', bio: 'Lead engineer for warehouse robot control software.', assigned: 2, capacity: 3, next: 'Fri 27 Nov, 10:00 AM' },
  { id: 6, name: 'Kemi Adebayo', kind: 'Industry mentor', org: 'Lagos Media House', bio: 'Head of production who guides interns through the full edit process.', assigned: 2, capacity: 3, next: 'Mon 30 Nov, 1:00 PM' },
  { id: 7, name: 'Dr. Aisha Lawal', kind: 'External assessor', org: 'Assessor panel', bio: 'Independent assessor for final defences.', assigned: 4, capacity: 8, next: 'Tue 1 Dec, 10:00 AM' },
]

export const defaultSettings = {
  pattern: '^VU/[A-Z]{3}/\\d{2}/\\d{4}$', sample: 'VU/SEN/22/4409',
  domainLock: true, domain: 'veritas.edu.ng',
  hours: 440, credits: 6, stipend: 100000, signoffDays: 7, dailyMax: 8,
  geofence: true, radius: 100, mismatchMinutes: 30,
  signatory: 'Dr. Ngozi Adeyemi', signatoryTitle: 'Practicum coordinator',
}

export const days = ['Mon 23 Nov', 'Tue 24 Nov', 'Wed 25 Nov', 'Thu 26 Nov', 'Fri 27 Nov']
export const hours = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00']
export const startSessions = [
  { day: 0, time: '10:00', title: 'Review', who: 'Tunde Bakare' },
  { day: 1, time: '15:00', title: 'Review', who: 'Blessing Adamu' },
  { day: 2, time: '14:00', title: 'Mid-placement review', who: 'Amara Okafor', next: true },
  { day: 3, time: '11:00', title: 'Defence preparation', who: 'Ifeanyi Nwosu' },
  { day: 4, time: '10:00', title: 'Check-in', who: 'Zainab Musa' },
]
export const startPending = [
  { id: 1, student: 'Samuel Ojo', kind: 'Mid-placement review' },
  { id: 2, student: 'Fatima Bello', kind: 'Hours discussion' },
  { id: 3, student: 'Chinedu Eze', kind: 'Placement planning' },
]
export const completed = [
  ['Tunde Bakare', 'Naija Fintech Labs', 'Onboarding review', '4.6 / 5.0', 'Signed by all three'],
  ['Ifeanyi Nwosu', 'Delta Analytics', 'Mid-placement review', '4.8 / 5.0', 'Signed by all three'],
  ['Blessing Adamu', 'Kano Design Studio', 'Onboarding review', '4.4 / 5.0', 'Waiting for host'],
]