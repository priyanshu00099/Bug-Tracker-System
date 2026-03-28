// src/components/LoginForm.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE || "https://bug-tracker-system-2mjo.onrender.com/api"}/auth/login`, {
        email,
        password,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token); // ✅ save JWT
        // optionally redirect based on role if backend includes it
        navigate("/admin");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Login failed");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Sign In</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}