import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileWidget from "./ProfileWidget";
import { MenuIcon } from "./Icons";

const TopNav = ({ userName, breadcrumb = "Overview" }) => {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const loadProfilePic = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const savedPic = localStorage.getItem(`profilePhoto_${payload.id}`);
          if (savedPic) setProfilePic(savedPic);
        } catch(err) {}
      }
    };
    
    // Initial Load
    loadProfilePic();
    
    // Listen for cross-component photo changes without Redux
    window.addEventListener('profilePhotoUpdated', loadProfilePic);
    return () => window.removeEventListener('profilePhotoUpdated', loadProfilePic);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/login");
  };

  const initial = userName ? userName.charAt(0).toUpperCase() : "U";

  return (
    <header className="app-header">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button className="mobile-menu-btn-alt" onClick={() => window.dispatchEvent(new Event('toggleSidebar'))}>
          <MenuIcon size={24} />
        </button>
        <div className="header-breadcrumbs">
          <span className="brand">Bug Tracker</span>
          <span>/</span>
          <span>{breadcrumb}</span>
        </div>
      </div>
      <div className="header-actions" style={{ position: 'relative' }}>
        <div 
          className="user-profile" 
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: '8px', transition: 'background 0.2s ease', backgroundColor: isProfileOpen ? 'rgba(255,255,255,0.05)' : 'transparent' }}
        >
          <span className="user-name" style={{fontSize: "0.9rem", color: "var(--text-primary)", fontWeight: "500"}}>{userName}</span>
          {profilePic ? (
             <img src={profilePic} alt="User Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
             <div className="user-avatar">{initial}</div>
          )}
        </div>
        
        {isProfileOpen && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 12px)',
            right: 0,
            width: '260px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
            zIndex: 100,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <ProfileWidget />
            <div style={{ borderTop: '1px solid var(--border-color)', padding: '8px' }}>
              <button 
                onClick={handleSignOut} 
                style={{ 
                  width: '100%', padding: '10px', borderRadius: '6px', textAlign: 'center', 
                  backgroundColor: 'transparent', color: 'var(--danger-red)', 
                  cursor: 'pointer', border: 'none', fontWeight: '500', transition: 'background 0.2s' 
                }} 
                onMouseEnter={(e) => e.target.style.backgroundColor='rgba(248, 81, 73, 0.1)'} 
                onMouseLeave={(e) => e.target.style.backgroundColor='transparent'}
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopNav;