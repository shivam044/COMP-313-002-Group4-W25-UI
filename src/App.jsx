import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import LoginForm from "./components/Auth/LoginForm";
import SubjectsPage from "./pages/SubjectsPage";
import SignupPage from "./components/Auth/SignupForm";
import Dashboard from "./components/Dashboard/Dashboard";
import ProfilePage from "./pages/ProfilePage";

import AssignmentPage from "./pages/AssignmentPage";
import AgendaPage from "./pages/AgendaPage";
import Grades from "./components/Grades/GradeList";
import SettingsPage from "./pages/SettingsPage";
import HelpPage from "./pages/HelpPage";

import FeedbackPage from "./pages/FeedbackPage";
import StudentPerformancePage from "./components/Feedback/StudentPerformancePage";
import AdminUserManagement from "./components/Admin/AdminUserManagement"
import AdminSystemAnalytics from "./components/Admin/AdminSystemAnalytics";
import PoliciesSettingsPage from "./components/Admin/PoliciesSettingsPage";

import Sidebar from "./components/Layouts/Sidebar";
import Topbar from "./components/Layouts/Topbar";
import ProtectedRoute from "./hooks/useAuth";
import CrudTestPage from "./pages/CrudTestPage";
import TeachersPage from "./pages/TeachersPage";
import SemestersPage from "./pages/SemestersPage";

import "./App.css";

// Layout wrapper to control Topbar and Sidebar visibility based on the route
function Layout({ children }) {
  const location = useLocation();
  const isLoginPage = location.pathname === "/" || location.pathname === "/signup";

  return (
    <div className="app-body">
      {!isLoginPage && (
        <>
          <div className="topbar-container">
            <Topbar />
          </div>
          <div className="sidebar-container">
            <Sidebar />
          </div>
        </>
      )}
      <main className={`main-container pad-0 ${isLoginPage ? "login-page" : ""}`}>
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Layout>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/crudtestpage" element={<CrudTestPage />} />
          <Route path="/teachers" element={<TeachersPage />} />
          <Route path="/semesters" element={<SemestersPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protect the routes by wrapping them in ProtectedRoute */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/grades"
            element={
              <ProtectedRoute>
                <Grades />
              </ProtectedRoute>
            }
          />
          <Route path="/assignments" element={<AssignmentPage />} />
          <Route path="/agenda" element={<AgendaPage />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/student/:studentId/performance" element={<StudentPerformancePage />} />
          
          {/* New Admin User Management Route */}
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <AdminUserManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/stats"
            element={
              <ProtectedRoute>
                <AdminSystemAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/policy"
            element={
              <ProtectedRoute>
                <PoliciesSettingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/help"
            element={
              <ProtectedRoute>
                <HelpPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
