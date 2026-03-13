import React from "react";
import { useNavigate } from "react-router-dom";

const TopNav = ({ userName }) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // ✅ Clear all auth info
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");

    // ✅ Redirect to login page
    navigate("/");
  };

  return (
    <div className="topnav">
      <span>Welcome, {userName}</span>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default TopNav;