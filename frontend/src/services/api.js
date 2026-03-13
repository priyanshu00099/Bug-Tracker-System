import axios from "axios";

const API_BASE = "http://localhost:5000/api"; // adjust port if needed

export const getBugs = async () => {
  const token = localStorage.getItem("token"); // ✅ retrieve token
  const res = await axios.get(`${API_BASE}/bugs`, {
    headers: {
      Authorization: `Bearer ${token}`, // ✅ send token
    },
  });
  return res.data;
};


export const createBug = async (bug) => {
  const res = await axios.post(`${API_BASE}/bugs`, bug);
  return res.data;
};

export const updateBugStatus = async (id, status) => {
  const res = await axios.put(`${API_BASE}/bugs/${id}`, { status });
  return res.data;
};

export const deleteBug = async (id) => {
  const res = await axios.delete(`${API_BASE}/bugs/${id}`);
  return res.data;
};