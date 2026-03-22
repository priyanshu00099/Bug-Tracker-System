import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DeveloperDashboard from "./pages/DeveloperDashboard";
import TesterDashboard from "./pages/TesterDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import BugList from "./components/BugList";
import ProtectedRoute from "./components/ProtectedRoute";
import FrontPage from "./pages/FrontPage";

function App() {
  const [role, setRole] = useState(localStorage.getItem("role") || null);

  const handleLogin = (userRole) => {
    setRole(userRole);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/" element={<LoginPage onLogin={handleLogin} />} />

        <Route
          path="/developer"
          element={
            <ProtectedRoute allowedRoles={["developer"]}>
              <DeveloperDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tester"
          element={
            <ProtectedRoute allowedRoles={["tester"]}>
              <TesterDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/buglist"
          element={
            <ProtectedRoute>
              <BugList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tester/buglist"
          element={
            <ProtectedRoute allowedRoles={["tester"]}>
              <BugList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/buglist"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <BugList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/developer/buglist"
          element={
            <ProtectedRoute allowedRoles={["developer"]}>
              <BugList />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;