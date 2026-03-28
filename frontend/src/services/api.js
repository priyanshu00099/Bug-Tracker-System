import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || `http://${window.location.hostname}:5000/api`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// Admin
export const getAllBugs = async () => {
  const res = await axios.get(`${API_BASE}/bugs`, { headers: getAuthHeaders() });
  return res.data;
};

export const getAllUsers = async () => {
  const res = await axios.get(`${API_BASE}/bugs/users/all`, { headers: getAuthHeaders() });
  return res.data;
};

// Tester
export const getTesterBugs = async () => {
  const res = await axios.get(`${API_BASE}/bugs/reported`, { headers: getAuthHeaders() });
  return res.data;
};

// Developer
export const getAssignedBugs = async () => {
  const res = await axios.get(`${API_BASE}/bugs/assigned`, { headers: getAuthHeaders() });
  return res.data;
};

export const getBugHistory = async () => {
  const res = await axios.get(`${API_BASE}/bugs/history`, { headers: getAuthHeaders() });
  return res.data;
};

// Create bug (tester)
export const createBug = async (bug) => {
  const res = await axios.post(`${API_BASE}/bugs`, bug, { headers: getAuthHeaders() });
  return res.data;
};

export const deleteBug = async (id) => {
  const res = await axios.delete(`${API_BASE}/bugs/${id}`, { 
    headers: getAuthHeaders() 
  });
  return res.data;
};

export const assignBug = async (id, developerId) => {
  const res = await axios.put(`${API_BASE}/bugs/${id}/assign`, { assignedTo: developerId }, { 
    headers: getAuthHeaders() 
  });
  return res.data;
};

export const updateBugStatus = async (id, status, appendDescription = null) => {
  const payload = { status };
  if (appendDescription) payload.appendDescription = appendDescription;
  
  const res = await axios.put(`${API_BASE}/bugs/${id}/status`, payload, { 
    headers: getAuthHeaders() 
  });
  return res.data;
};

// --- SuperAdmin ---
export const getSuperAdminUsers = async () => {
  const res = await axios.get(`${API_BASE}/users`, { headers: getAuthHeaders() });
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await axios.delete(`${API_BASE}/users/${id}`, { headers: getAuthHeaders() });
  return res.data;
};

export const updateUserRole = async (id, role) => {
  const res = await axios.put(`${API_BASE}/users/${id}/role`, { role }, { headers: getAuthHeaders() });
  return res.data;
};

export const updateUserDetails = async (id, details) => {
  const res = await axios.put(`${API_BASE}/users/${id}/details`, details, { headers: getAuthHeaders() });
  return res.data;
};