export const filters = ['All', 'Tripartite', 'Mentors', 'Cohorts']
export const conversations = [
  { id: 1, group: 'Tripartite', title: 'Eko Cloud tripartite review', people: 'Chidi Eze · Dr. Ngozi Adeyemi · Amara Okafor', preview: 'Dr. Adeyemi: Please sign the weekly reflection...', time: '11:42 AM', messages: [
    { from: 'Chidi Eze', role: 'Host supervisor', time: '10:15 AM', text: "Amara pushed the regional latency patch this morning. We saw a 14% drop in round-trip times. Ready to review in tomorrow's session." },
    { from: 'You', me: true, time: '10:45 AM', text: 'I also compiled my benchmark graphs and attached the updated daily logbook for Week 6.', file: 'Week6-Benchmark-Metrics.pdf · 1.8 MB' },
    { from: 'Dr. Ngozi Adeyemi', role: 'Faculty lead', time: '11:42 AM', text: "Excellent work, Amara. Your rubric score for technical performance is already strong. Please make sure your supervisor signs the weekly reflection before tomorrow's call." },
  ] },
  { id: 2, group: 'Mentors', title: 'Chidi Eze', people: 'Host supervisor · Eko Cloud Systems', preview: 'Great work on the Terraform staging...', time: 'Yesterday', messages: [
    { from: 'Chidi Eze', role: 'Host supervisor', time: 'Yesterday', text: 'Great work on the Terraform staging scripts. Keep the commit messages this clear.' },
  ] },
  { id: 3, group: 'Mentors', title: 'Career advisory desk', people: 'Veritas University', preview: 'Drop-in clinic slots are open on Friday.', time: 'Mon', messages: [
    { from: 'Career advisory desk', role: 'Institution', time: 'Mon', text: 'Drop-in CV clinic slots are open on Friday. Book one before you apply for final placements.' },
  ] },
  { id: 4, group: 'Cohorts', title: 'Final year interns 2026', people: '12 students', preview: 'Ifeanyi: Is anyone presenting at the symposium?', time: 'Mon', messages: [
    { from: 'Ifeanyi', role: 'Student', time: 'Mon', text: 'Is anyone presenting at the faculty symposium next month?' },
  ] },
]