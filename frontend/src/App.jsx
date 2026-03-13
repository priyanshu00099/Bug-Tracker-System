import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DeveloperDashboard from "./pages/DeveloperDashboard";
import TesterDashboard from "./pages/TesterDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import BugList from "./components/BugList";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [role, setRole] = useState(localStorage.getItem("role") || null);

  const handleLogin = (userRole) => {
    setRole(userRole);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage onLogin={handleLogin} />} />

        <Route
          path="/developer"
          element={
            <ProtectedRoute>
              <DeveloperDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tester"
          element={
            <ProtectedRoute>
              <TesterDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
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
      </Routes>
    </Router>
  );
}

export default App;