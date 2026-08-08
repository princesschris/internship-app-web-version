import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import RoleSelection from './pages/RoleSelection';
import StudentSignUp from './pages/auth/StudentSignUp';
import StudentLogin from './pages/auth/StudentLogin';
import OrganizationSignUp from './pages/auth/OrganizationSignUp';
import OrganizationLogin from './pages/auth/OrganizationLogin';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import ChangePassword from './pages/ChangePassword';

import InternshipList from './pages/InternshipList';
import InternshipDetail from './pages/InternshipDetail';
import AddInternship from './pages/AddInternship';
import EditInternship from './pages/EditInternship';
import Applications from './pages/Applications';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import AddExperience from './pages/AddExperience';
import Home from './pages/Home';
import OrganizationsMap from './pages/OrganizationsMap';

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/student/signup" element={<StudentSignUp />} />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/organization/signup" element={<OrganizationSignUp />} />
        <Route path="/organization/login" element={<OrganizationLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/internships" element={<InternshipList />} />
        <Route path="/map" element={<OrganizationsMap />} />
        <Route path="/internships/:id" element={<InternshipDetail />} />
        <Route
          path="/internships/new"
          element={
            <ProtectedRoute role="organization">
              <AddInternship />
            </ProtectedRoute>
          }
        />
        <Route
          path="/internships/:id/edit"
          element={
            <ProtectedRoute role="organization">
              <EditInternship />
            </ProtectedRoute>
          }
        />

        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <Applications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/experience/new"
          element={
            <ProtectedRoute role="student">
              <AddExperience />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}