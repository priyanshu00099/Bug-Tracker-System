import React, { useState, useEffect } from 'react';

const ProfileWidget = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [userInfo, setUserInfo] = useState({ name: '', role: '', id: 'Loading...' });

  useEffect(() => {
    const name = localStorage.getItem("name") || "Unknown User";
    const role = localStorage.getItem("role") || "Unknown Role";
    const token = localStorage.getItem("token");
    let userId = "Unknown ID";

    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        const decodedJson = atob(payloadBase64);
        const decodedMeta = JSON.parse(decodedJson);
        userId = decodedMeta.id || "N/A";
      } catch (err) {
        console.error("Failed to decode token", err);
      }
    }

    setUserInfo({ name, role, id: userId });

    // Load saved picture
    const savedPic = localStorage.getItem(`profilePhoto_${userId}`);
    if (savedPic) {
      setProfilePic(savedPic);
      // Trigger a custom event so TopNav can react immediately
      window.dispatchEvent(new Event('profilePhotoUpdated'));
    }
  }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfilePic(base64String);
        localStorage.setItem(`profilePhoto_${userInfo.id}`, base64String);
        // Dispatch to update TopNav instantly
        window.dispatchEvent(new Event('profilePhotoUpdated'));
      };
      reader.readAsDataURL(file);
    }
  };

  const initial = userInfo.name ? userInfo.name.charAt(0).toUpperCase() : "U";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '24px 16px' }}>
      <div style={{ position: 'relative', width: '96px', height: '96px', marginBottom: '16px' }}>
        {profilePic ? (
          <img 
            src={profilePic} 
            alt="Profile" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', border: '2px solid var(--accent-green)' }} 
          />
        ) : (
          <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: 'var(--accent-green)', color: 'var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
            {initial}
          </div>
        )}
        
        {/* Invisible Overlay for Upload */}
        <label 
          htmlFor="profile-upload" 
          style={{ 
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
            borderRadius: '50%', cursor: 'pointer', backgroundColor: 'rgba(0,0,0,0.5)',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: 0, transition: 'opacity 0.2s ease', 
            fontSize: '0.8rem', fontWeight: '500'
          }}
          onMouseEnter={(e) => e.target.style.opacity = 1}
          onMouseLeave={(e) => e.target.style.opacity = 0}
        >
          Change Mode
        </label>
        <input 
          id="profile-upload" 
          type="file" 
          accept="image/*" 
          onChange={handlePhotoUpload} 
          style={{ display: 'none' }} 
        />
      </div>

      <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: 'var(--text-primary)' }}>{userInfo.name}</h3>
      <span style={{ fontSize: '0.9rem', color: 'var(--accent-green)', fontWeight: '500', marginBottom: '8px' }}>
        {userInfo.role.charAt(0).toUpperCase() + userInfo.role.slice(1)}
      </span>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', backgroundColor: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px' }}>
        User ID: {userInfo.id}
      </div>
    </div>
  );
};

export default ProfileWidget;
