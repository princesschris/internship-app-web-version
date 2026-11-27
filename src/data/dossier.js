// Sample detail data shared by every placement. Replace with Supabase later.
export const dossier = {
  student: { name: 'Amara Okafor', matric: 'VU/SEN/22/4409', cgpa: '4.52 / 5.0', faculty: 'Faculty of Computing, Veritas University' },
  credentials: [
    ['Official academic transcript', 'Synced from student records · Harmattan 2025 finalised'],
    ['Academic CV', 'Updated 3 days ago'],
    ['GitHub portfolio', 'github.com/amara-okafor'],
  ],
  dates: [['Applications close', '2026-12-18'], ['Interview window', '2027-01-05'], ['Placement starts', '2027-02-02']],
  build: [
    ['Payment pipelines', 'Instrument and stress-test event processing that handles thousands of transactions a second.'],
    ['Database replication', 'Work with the core team on failover tests and recovery from partitions.'],
    ['Zero-downtime releases', 'Shadow senior engineers on staged rollouts and write post-incident reviews.'],
  ],
  prerequisites: [
    ['CSC 301 Distributed Systems', 'Grade A, completed 2025'],
    ['CSC 210 Data Structures', 'Grade A-, completed 2024'],
    ['Credit units earned', '114 of 120 required'],
  ],
  supervisor: {
    name: 'Chidi Eze', role: 'Senior Platform Engineer', cohorts: 6,
    bio: 'Chidi has led systems design for seven years and has supervised six intern cohorts from Nigerian universities.',
    quote: 'We pair interns with engineers on live work, in regular pairing sessions. You are never left alone with a problem.',
  },
}