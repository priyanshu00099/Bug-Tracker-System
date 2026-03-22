import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";
import "../styles/FrontPage.css";

const FrontPage = () => {
  const navigate = useNavigate();

  return (
    <div className="frontpage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>🐞 Bug Tracker</h1>
          <p>Track, assign, and resolve bugs with ease.</p>
          <button onClick={() => navigate("/login")} className="cta-btn">
            Get Started
          </button>
        </div>
        <div className="hero-image">
          <img src="/images/dashboard-preview.png" alt="Bug Tracker Dashboard" />
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <h2>About Bug Tracker</h2>
        <p>
          A modern, Jira-inspired bug tracking system built for teams. 
          Secure authentication, role-based dashboards, and real-time analytics 
          make collaboration seamless.
        </p>
      </section>

      {/* Roles Section */}
      <section className="roles">
        <h2>Roles & Responsibilities</h2>
        <div className="role-grid">
          <div className="role-card admin">
            <img src="/images/admin.png" alt="Admin" />
            <h3>Admin</h3>
            <p>Manage all bugs, assign tasks, and oversee progress.</p>
          </div>
          <div className="role-card tester">
            <img src="/images/tester.png" alt="Tester" />
            <h3>Tester</h3>
            <p>Report bugs, verify fixes, and ensure quality.</p>
          </div>
          <div className="role-card developer">
            <img src="/images/developer.png" alt="Developer" />
            <h3>Developer</h3>
            <p>Fix assigned bugs, update statuses, and maintain history.</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Features</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <img src="/images/security.png" alt="Security" />
            <h4>Secure Authentication</h4>
            <p>JWT-based login with role enforcement.</p>
          </div>
          <div className="feature-card">
            <img src="/images/charts.png" alt="Analytics" />
            <h4>Analytics</h4>
            <p>Interactive charts for bug trends & severity.</p>
          </div>
          <div className="feature-card">
            <img src="/images/realtime.png" alt="Real-time" />
            <h4>Real-Time Updates</h4>
            <p>Instant bug reporting and status tracking.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>📍 K.R. Mangalam University, Gurugram, Haryana, India</p>
        <p>Contact: bugtracker@krmangalam.edu.in</p>
        <p>© 2026 Bug Tracker Project</p>
      </footer>
    </div>
  );
};

export default FrontPage;