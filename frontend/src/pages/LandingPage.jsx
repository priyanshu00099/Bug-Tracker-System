import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";

// Icons as SVG components
function BugIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m8 2 1.88 1.88" /><path d="M14.12 3.88 16 2" /><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
      <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
      <path d="M12 20v-9" /><path d="M6.53 9C4.6 8.8 3 7.1 3 5" /><path d="M6 13H2" /><path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
      <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" /><path d="M22 13h-4" /><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
    </svg>
  );
}

function MenuIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function XIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
  );
}

function ShieldIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ChartIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v16a2 2 0 0 0 2 2h16" /><path d="m19 9-5 5-4-4-3 3" />
    </svg>
  );
}

function ZapIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </svg>
  );
}

function UsersIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function GitBranchIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" x2="6" y1="3" y2="15" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  );
}

function BellIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function SettingsIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function SearchIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function CodeIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function CheckIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ArrowRightIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function MailIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function PhoneIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MapPinIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

// Header Component
function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="container header-inner">
        <a href="#" className="logo">
          <div className="logo-icon">
            <BugIcon size={18} />
          </div>
          Bug Tracker
        </a>

        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#roles">Roles</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="header-buttons">
        <button onClick={() => navigate("/login")} className="btn btn-secondary">
            Sign In
          </button>
          <button onClick={() => navigate("/login")} className="btn btn-primary">
            Get Started
          </button>
        </div>

        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
        <a href="#features">Features</a>
        <a href="#roles">Roles</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
        <div className="mobile-menu-buttons">
          <a href="#" className="btn btn-secondary">Sign In</a>
          <a href="#" className="btn btn-primary">Get Started</a>
        </div>
      </div>
    </header>
  );
}

// Hero Section
function HeroSection() {
  const stats = [
    { value: "99.9%", label: "Uptime" },
    { value: "50K+", label: "Bugs Tracked" },
    { value: "500+", label: "Teams" },
    { value: "24/7", label: "Support" },
  ];

  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-blur-1" />
      <div className="hero-blur-2" />

      <div className="container hero-content">
        <div className="hero-badge">
          <span className="badge-dot" />
          Now in Beta - Try it Free
        </div>

        <h1>
          Track Bugs.<br />
          <span>Ship Faster.</span>
        </h1>

        <p className="hero-description">
          A modern, Jira-inspired bug tracking system built for teams. Secure
          authentication, role-based dashboards, and real-time analytics to
          keep your projects on track.
        </p>

        <div className="hero-buttons">
          <a href="#" className="btn btn-accent btn-lg">
            Start Free Trial
            <ArrowRightIcon />
          </a>
          <a href="#" className="btn btn-secondary btn-lg">
            View Demo
          </a>
        </div>

        <div className="hero-stats">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Features Section
function FeaturesSection() {
  const features = [
    {
      icon: <ShieldIcon size={24} />,
      title: "Secure Authentication",
      description: "Enterprise-grade security with role-based access control and encrypted data storage.",
      color: "green",
    },
    {
      icon: <ChartIcon size={24} />,
      title: "Real-time Analytics",
      description: "Track team performance and bug resolution metrics with interactive dashboards.",
      color: "blue",
    },
    {
      icon: <ZapIcon size={24} />,
      title: "Instant Updates",
      description: "Real-time notifications and live updates keep your team synchronized.",
      color: "purple",
    },
    {
      icon: <UsersIcon size={24} />,
      title: "Team Collaboration",
      description: "Built-in commenting, assignments, and mentions for seamless teamwork.",
      color: "orange",
    },
    {
      icon: <GitBranchIcon size={24} />,
      title: "Version Control",
      description: "Link commits and pull requests directly to bug reports for full traceability.",
      color: "cyan",
    },
    {
      icon: <BellIcon size={24} />,
      title: "Smart Notifications",
      description: "Customizable alerts via email, Slack, or in-app to stay informed.",
      color: "yellow",
    },
  ];

  return (
    <section id="features" className="features">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Features</span>
          <h2 className="section-title">Everything You Need</h2>
          <p className="section-description">
            Powerful tools designed to streamline your bug tracking workflow
            and boost team productivity.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className={`feature-icon ${feature.color}`}>
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Roles Section
function RolesSection() {
  const roles = [
    {
      icon: <SettingsIcon size={28} />,
      title: "Administrator",
      description: "Full system control with user management, project settings, and analytics access.",
      color: "admin",
      features: ["Manage users & permissions", "Configure projects", "Access all reports", "System settings"],
    },
    {
      icon: <SearchIcon size={28} />,
      title: "Tester",
      description: "Report and track bugs with detailed reproduction steps and priority levels.",
      color: "tester",
      features: ["Create bug reports", "Attach screenshots", "Track bug status", "Verify fixes"],
    },
    {
      icon: <CodeIcon size={28} />,
      title: "Developer",
      description: "View assigned bugs, update progress, and collaborate with the team.",
      color: "developer",
      features: ["View assignments", "Update status", "Add comments", "Link commits"],
    },
  ];

  return (
    <section id="roles" className="roles">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Roles</span>
          <h2 className="section-title">Built for Every Team Member</h2>
          <p className="section-description">
            Role-based dashboards tailored to each team member&apos;s workflow
            and responsibilities.
          </p>
        </div>

        <div className="roles-grid">
          {roles.map((role, index) => (
            <div key={index} className="role-card">
              <div className={`role-icon ${role.color}`}>{role.icon}</div>
              <h3>{role.title}</h3>
              <p>{role.description}</p>
              <ul className="role-features">
                {role.features.map((feature, i) => (
                  <li key={i}>
                    <span className="check-icon">
                      <CheckIcon />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="cta">
      <div className="cta-blur" />
      <div className="container cta-content">
        <h2>Ready to Squash Some Bugs?</h2>
        <p>
          Join thousands of teams already using Bug Tracker to ship better
          software, faster.
        </p>
        <div className="cta-buttons">
          <a href="#" className="btn btn-accent btn-lg">
            Start Free Trial
            <ArrowRightIcon />
          </a>
          <a href="#" className="btn btn-secondary btn-lg">
            Contact Sales
          </a>
        </div>
      </div>
    </section>
  );
}

// Footer Component
function Footer() {
  return (
    <footer id="contact" className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#" className="logo">
              <div className="logo-icon">
                <BugIcon size={18} />
              </div>
              Bug Tracker
            </a>
            <p>
              A modern bug tracking solution designed for teams who want to
              ship quality software faster.
            </p>
            <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <a href="mailto:hello@bugtracker.dev" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#737373", textDecoration: "none", fontSize: "0.875rem" }}>
                <MailIcon size={16} />
                hello@bugtracker.dev
              </a>
              <a href="tel:+1234567890" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#737373", textDecoration: "none", fontSize: "0.875rem" }}>
                <PhoneIcon size={16} />
                +1 (234) 567-890
              </a>
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#737373", fontSize: "0.875rem" }}>
                <MapPinIcon size={16} />
                San Francisco, CA
              </span>
            </div>
          </div>

          <div className="footer-section">
            <h4>Product</h4>
            <ul>
              <li><a href="#">Features</a></li>
              <li><a href="#">Pricing</a></li>
              <li><a href="#">Integrations</a></li>
              <li><a href="#">Changelog</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li><a href="#">Documentation</a></li>
              <li><a href="#">API Reference</a></li>
              <li><a href="#">Support</a></li>
              <li><a href="#">Status</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Bug Tracker. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Main Page Component
export default function LandingPage() {
  return (
    <div className="landing-page">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <RolesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}