import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import RequireRole, { RootRedirect } from './components/auth/RequireRole'
import AuthLayout from './components/layout/AuthLayout'
import StudentLayout from './components/layout/StudentLayout'
import SignIn from './pages/auth/SignIn'
import CreateAccount from './pages/auth/CreateAccount'
import ComingSoon from './pages/ComingSoon'
import InstitutionLayout from './components/layout/InstitutionLayout'
import Overview from './pages/institution/Overview'
import StudentRoster from './pages/institution/StudentRoster'
import VerificationQueue from './pages/institution/VerificationQueue'
import InstitutionProfile from './pages/institution/InstitutionProfile'
import FacultyMentors from './pages/institution/FacultyMentors'
import SetupGovernance from './pages/institution/SetupGovernance'
import SupervisionSchedule from './pages/institution/SupervisionSchedule'
import Dashboard from './pages/student/Dashboard'
import ExploreInternships from './pages/student/ExploreInternships'
import InternshipDetail from './pages/student/InternshipDetail'
import AttendanceLogbook from './pages/student/AttendanceLogbook'
import PracticumMilestones from './pages/student/PracticumMilestones'
import Messages from './pages/student/Messages'
import Profile from './pages/student/Profile'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route element={<AuthLayout />}>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<CreateAccount />} />
          </Route>

          <Route element={<RequireRole role="student" />}>
            <Route path="/student" element={<StudentLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="explore" element={<ExploreInternships />} />
              <Route path="explore/:id" element={<InternshipDetail />} />
              <Route path="attendance" element={<AttendanceLogbook />} />
              <Route path="milestones" element={<PracticumMilestones />} />
              <Route path="messages" element={<Messages />} />
              <Route path="profile" element={<Profile />} />
              <Route path="*" element={<p className="px-6 py-20 text-center text-muted">This page is coming soon.</p>} />
            </Route>
          </Route>

          <Route element={<RequireRole role="institution" />}>
            <Route path="/institution" element={<InstitutionLayout />}>
              <Route index element={<Overview />} />
              <Route path="roster" element={<StudentRoster />} />
              <Route path="verification" element={<VerificationQueue />} />
              <Route path="profile" element={<InstitutionProfile />} />
              <Route path="mentors" element={<FacultyMentors />} />
              <Route path="schedule" element={<SupervisionSchedule />} />
              <Route path="setup" element={<SetupGovernance />} />
              <Route path="*" element={<p className="px-6 py-20 text-center text-muted">This page is coming soon.</p>} />
            </Route>
          </Route>

          {['organisation', 'admin'].map((r) => (
            <Route key={r} element={<RequireRole role={r} />}>
              <Route path={`/${r}/*`} element={<ComingSoon role={r} />} />
            </Route>
          ))}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}