import React, { useEffect, useState } from "react";
import "../styles/global.css";
import "../styles/Dashboard.css";
import NavBar from "../components/NavBar";
import TopNav from "../components/TopNav";
import { ListIcon, AlertCircleIcon, UserIcon } from "../components/Icons"; // assuming UserIcon exists or reusing one
import { getSuperAdminUsers, deleteUser, updateUserRole, updateUserDetails } from "../services/api";
import axios from "axios";

const SuperAdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "Developer" });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState({ id: "", name: "", email: "", password: "", additional_roles: [] });

  const userName = localStorage.getItem("name") || "SuperAdmin";
  const userId = parseInt(localStorage.getItem("userId") || "0", 10);

  const fetchUsers = async () => {
    try {
      const data = await getSuperAdminUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        fetchUsers();
      } catch (err) {
        alert("Failed to delete user: " + (err.response?.data?.error || err.message));
      }
    }
  };

  const handleRoleUpdate = async (id, newRole) => {
    try {
      await updateUserRole(id, newRole);
      fetchUsers();
    } catch (err) {
      alert("Failed to update role: " + (err.response?.data?.error || err.message));
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://${window.location.hostname}:5000/api/auth/register`, newUser);
      alert("User created successfully!");
      setShowAddModal(false);
      setNewUser({ name: "", email: "", password: "", role: "Developer" });
      fetchUsers();
    } catch (err) {
      alert("Failed to create user: " + (err.response?.data?.error || err.message));
    }
  };

  const handleOpenEditModal = (u) => {
    const addRoles = u.additional_roles ? u.additional_roles.split(",").map(r => r.trim()).filter(Boolean) : [];
    setEditUser({ id: u.id, name: u.name, email: u.email, password: "", additional_roles: addRoles });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserDetails(editUser.id, {
        name: editUser.name,
        email: editUser.email,
        password: editUser.password,
        additional_roles: editUser.additional_roles.join(",")
      });
      alert("User details updated successfully!");
      setShowEditModal(false);
      fetchUsers();
    } catch (err) {
      alert("Failed to update user details: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="app-container">
      <div className="grid-background" />
      <div className="gradient-orb gradient-orb-1" />
      
      <NavBar role="superadmin" activePath="/superadmin" />

      <main className="main-wrapper">
        <TopNav userName={userName} breadcrumb="User Management" />

        <div className="main-content">
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 className="page-title">SuperAdmin User Management</h1>
            <button className="auth-button" style={{ width: 'auto', padding: '10px 20px' }} onClick={() => setShowAddModal(true)}>
              + Add New User
            </button>
          </div>

          <div style={{ width: '100%', marginBottom: '24px' }}>
            <div className="chart-container" style={{ overflowX: 'auto', width: '100%' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '12px' }}>ID</th>
                    <th style={{ padding: '12px' }}>Name</th>
                    <th style={{ padding: '12px' }}>Email</th>
                    <th style={{ padding: '12px' }}>Role</th>
                    <th style={{ padding: '12px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>Loading...</td></tr>
                  ) : users.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px' }}>#{u.id}</td>
                      <td style={{ padding: '12px' }}>{u.name}</td>
                      <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{u.email}</td>
                      <td style={{ padding: '12px' }}>
                        <select 
                          value={u.role} 
                          onChange={(e) => handleRoleUpdate(u.id, e.target.value)}
                          disabled={u.id === userId}
                          style={{
                            background: 'var(--surface-color)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '4px',
                            padding: '4px 8px'
                          }}
                        >
                          <option value="Admin">Admin</option>
                          <option value="Developer">Developer</option>
                          <option value="Tester">Tester</option>
                          <option value="SuperAdmin">SuperAdmin</option>
                        </select>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => handleOpenEditModal(u)}
                            style={{
                              background: 'var(--accent-blue, #007bff)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '6px 12px',
                              cursor: 'pointer'
                            }}
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(u.id)}
                            disabled={u.id === userId}
                            style={{
                              background: u.id === userId ? '#555' : 'var(--accent-red, #ff4c4c)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '6px 12px',
                              cursor: u.id === userId ? 'not-allowed' : 'pointer',
                              opacity: u.id === userId ? 0.5 : 1
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {showAddModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{
            background: 'var(--surface-color)', padding: '24px', borderRadius: '12px', width: '400px',
            border: '1px solid var(--border-color)'
          }}>
            <h2 style={{ marginBottom: '16px' }}>Add New User</h2>
            <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input 
                className="auth-input" type="text" placeholder="Name" required
                value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})}
              />
              <input 
                className="auth-input" type="email" placeholder="Email" required
                value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})}
              />
              <input 
                className="auth-input" type="password" placeholder="Password" required
                value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})}
              />
              <select 
                className="auth-input" required
                value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}
              >
                <option value="Admin">Admin</option>
                <option value="Developer">Developer</option>
                <option value="Tester">Tester</option>
                <option value="SuperAdmin">SuperAdmin</option>
              </select>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="submit" className="auth-button" style={{ flex: 1 }}>Create</button>
                <button type="button" className="auth-button" style={{ flex: 1, background: 'transparent', border: '1px solid var(--border-color)' }} onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{
            background: 'var(--surface-color)', padding: '24px', borderRadius: '12px', width: '400px',
            border: '1px solid var(--border-color)'
          }}>
            <h2 style={{ marginBottom: '16px' }}>Edit User Details</h2>
            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input 
                className="auth-input" type="text" placeholder="Name" required
                value={editUser.name} onChange={e => setEditUser({...editUser, name: e.target.value})}
              />
              <input 
                className="auth-input" type="email" placeholder="Email" required
                value={editUser.email} onChange={e => setEditUser({...editUser, email: e.target.value})}
              />
              <input 
                className="auth-input" type="password" placeholder="New Password (leave blank to keep current)" 
                value={editUser.password} onChange={e => setEditUser({...editUser, password: e.target.value})}
              />
              
              <div style={{ padding: '8px 0' }}>
                <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>Secondary Access (Additional Roles)</p>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  {["Admin", "Developer", "Tester", "SuperAdmin"].map(role => (
                    <label key={role} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input 
                        type="checkbox" 
                        checked={editUser.additional_roles.includes(role)}
                        onChange={(e) => {
                          const newRoles = e.target.checked 
                            ? [...editUser.additional_roles, role] 
                            : editUser.additional_roles.filter(r => r !== role);
                          setEditUser({ ...editUser, additional_roles: newRoles });
                        }}
                      />
                      {role}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="submit" className="auth-button" style={{ flex: 1 }}>Save Changes</button>
                <button type="button" className="auth-button" style={{ flex: 1, background: 'transparent', border: '1px solid var(--border-color)' }} onClick={() => setShowEditModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
