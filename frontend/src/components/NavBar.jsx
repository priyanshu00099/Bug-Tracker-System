import React, { useState, useEffect } from "react";
import { BugIcon, GridIcon, ListIcon, ChartIcon, AlertCircleIcon, XIcon } from "./Icons";
import { getAllBugs, getAllUsers } from "../services/api";

const AdminTeamWidget = () => {
  const [bugs, setBugs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const b = await getAllBugs();
        setBugs(b || []);
      } catch (e) {}
      try {
        const u = await getAllUsers();
        setUsers(u || []);
      } catch (e) {}
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return null;

  const allDevelopers = users.filter((u) => u.role.toLowerCase() === "developer");

  return (
    <div style={{ padding: '0 16px 24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '12px', letterSpacing: '0.5px' }}>Team Allocation</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {allDevelopers.map((dev) => {
          const assignedBugs = bugs.filter((b) => b.assignedTo === dev.id);
          const resolvedCount = assignedBugs.filter((b) => ["Closed", "Resolved", "Verified"].includes(b.status)).length;
          const openBugs = assignedBugs.filter((b) => !["Closed", "Resolved", "Verified"].includes(b.status));

          return (
            <div key={dev.id} style={{ fontSize: '0.8rem', padding: '10px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                {dev.name}{" "}
                <span style={{ color: 'var(--text-secondary)', fontWeight: 'normal' }}>#{dev.id}</span>
              </div>

              {assignedBugs.length === 0 ? (
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontStyle: 'italic' }}>
                  Not assigned to any bug
                </div>
              ) : (
                <>
                  {openBugs.length > 0 && (
                    <div style={{ color: 'var(--accent-green)', lineHeight: '1.4' }}>
                      Active: {openBugs.map((b) => `#${b.id}`).join(", ")}
                    </div>
                  )}
                  {resolvedCount > 0 && (
                    <div style={{ color: 'var(--text-secondary)' }}>
                      Previously Resolved: {resolvedCount} bugs
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function NavBar({ role, activePath }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsMobileOpen(prev => !prev);
    window.addEventListener('toggleSidebar', handleToggle);
    return () => window.removeEventListener('toggleSidebar', handleToggle);
  }, []);

  const getNavLinks = () => {
    switch (role) {
      case "admin":
        return [
          { label: "Overview", path: "/admin", icon: <GridIcon size={18} /> },
          { label: "Reported Bugs", path: "/admin/reported-bugs", icon: <AlertCircleIcon size={18} /> },
          { label: "All Bugs", path: "/buglist", icon: <ListIcon size={18} /> },
          { label: "Analytics", path: "/analytics", icon: <ChartIcon size={18} /> }
        ];
      case "developer":
        return [
          { label: "Overview", path: "/developer", icon: <GridIcon size={18} /> },
          { label: "My Bugs", path: "/buglist", icon: <ListIcon size={18} /> },
          { label: "Performance", path: "/analytics", icon: <ChartIcon size={18} /> }
        ];
      case "tester":
        return [
          { label: "Overview", path: "/tester", icon: <GridIcon size={18} /> },
          { label: "Reported Bugs", path: "/tester/buglist", icon: <ListIcon size={18} /> }
        ];
      case "superadmin":
        return [
          { label: "User Management", path: "/superadmin", icon: <GridIcon size={18} /> }
        ];
      default:
        return [
          { label: "Dashboard", path: "/", icon: <GridIcon size={18} /> },
          { label: "Bugs", path: "/buglist", icon: <ListIcon size={18} /> }
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <>
      {isMobileOpen && (
        <div className="mobile-overlay" onClick={() => setIsMobileOpen(false)} />
      )}
      <aside className={`app-sidebar ${isMobileOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="sidebar-logo">
              <BugIcon size={20} />
            </div>
            <span className="sidebar-title">Bug Tracker</span>
          </div>
          <button className="mobile-menu-btn-alt" onClick={() => setIsMobileOpen(false)}>
            <XIcon size={24} />
          </button>
        </div>
      <nav className="sidebar-nav" style={{ marginBottom: role === "admin" ? '24px' : 'auto' }}>
        {navLinks.map((link) => (
          <a key={link.path} href={link.path} className={activePath === link.path ? "active" : ""}>
            {link.icon}
            {link.label}
          </a>
        ))}
      </nav>
      {role === "admin" && <AdminTeamWidget />}
      </aside>
    </>
  );
}
