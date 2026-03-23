import React, { useEffect, useState } from "react";
import "../styles/global.css";
import "../styles/Dashboard.css";
import NavBar from "../components/NavBar";
import TopNav from "../components/TopNav";
import "../components/Dashboard";
import { AlertCircleIcon, ActivityIcon, CheckCircleIcon, ListIcon } from "../components/Icons";
import { Bar } from "react-chartjs-2";
import { getTesterBugs, createBug } from "../services/api";

const TesterDashboard = () => {
  const [bugs, setBugs] = useState([]);
  const [formData, setFormData] = useState({ title: "", description: "", severity: "Minor", priority: "Low", image: null });
  const [submitStatus, setSubmitStatus] = useState({ message: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userName = localStorage.getItem("name") || "Tester User";

  const fetchBugs = async () => {
    try {
      const data = await getTesterBugs();
      setBugs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Frontend Error:", err);
      setBugs([]); 
    }
  };

  useEffect(() => {
    fetchBugs();
  }, []);

  const handleCreateBug = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ message: "", type: "" });
    try {
      let payload = formData;
      if (formData.image) {
        payload = new FormData();
        payload.append("title", formData.title);
        payload.append("description", formData.description);
        payload.append("severity", formData.severity);
        payload.append("priority", formData.priority);
        payload.append("image", formData.image);
      }
      await createBug(payload);
      setSubmitStatus({ message: "Bug reported successfully!", type: "success" });
      setFormData({ title: "", description: "", severity: "Minor", priority: "Low", image: null });
      // Reset the file input visually
      const fileInput = document.getElementById("bug-image");
      if (fileInput) fileInput.value = "";
      fetchBugs(); // Refresh metrics
    } catch (err) {
      setSubmitStatus({ message: err.response?.data?.error || "Failed to report bug.", type: "error" });
    }
    setIsSubmitting(false);
  };

  const reported = bugs.length;
  const verified = bugs.filter(b => b.status === "Closed").length;
  const reopened = bugs.filter(b => b.description && b.description.includes("--- REJECTED BY TESTER ---")).length;

  const testerData = {
    labels: [userName],
    datasets: [{ label: "Bugs Reported", data: [reported], backgroundColor: "#3fb950", borderRadius: 4 }],
  };

  return (
    <div className="app-container">
      <div className="grid-background" />
      <div className="gradient-orb gradient-orb-1" />
      <div className="gradient-orb gradient-orb-2" />
      
      <NavBar role="tester" activePath="/tester" />

      <main className="main-wrapper">
        <TopNav userName={userName} breadcrumb="Overview" />

        <div className="main-content">
          <div className="page-header">
            <h1 className="page-title">QA & Testing Hub</h1>
          </div>

          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-info">
                <h3>Reported Bugs</h3>
                <p>{reported}</p>
              </div>
              <div className="metric-icon"><ListIcon size={24}/></div>
            </div>
            <div className="metric-card">
              <div className="metric-info">
                <h3>Verified Bugs</h3>
                <p>{verified}</p>
              </div>
              <div className="metric-icon"><CheckCircleIcon size={24}/></div>
            </div>
            <div className="metric-card">
              <div className="metric-info">
                <h3>Reopened Bugs</h3>
                <p>{reopened}</p>
              </div>
              <div className="metric-icon"><AlertCircleIcon size={24}/></div>
            </div>
          </div>

          <div className="charts-grid">
            <div className="chart-container">
              <h3>Tester Contributions</h3>
              <Bar key={JSON.stringify(testerData)} data={testerData} options={{ responsive: true }} />
            </div>

            <div className="chart-container">
              <h3>Report New Bug</h3>
              {submitStatus.message && (
                <div style={{ marginBottom: '16px', padding: '12px', borderRadius: '8px', backgroundColor: submitStatus.type === 'error' ? 'rgba(248, 81, 73, 0.1)' : 'rgba(63, 185, 80, 0.1)', color: submitStatus.type === 'error' ? 'var(--danger-red)' : 'var(--accent-green)', border: `1px solid ${submitStatus.type === 'error' ? 'rgba(248, 81, 73, 0.3)' : 'rgba(63, 185, 80, 0.3)'}` }}>
                  {submitStatus.message}
                </div>
              )}
              <form onSubmit={handleCreateBug}>
                <input 
                  type="text" 
                  placeholder="Bug Title" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required 
                />
                <textarea 
                  placeholder="Detailed Description" 
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required 
                />
                
                <div style={{ display: 'flex', gap: '16px' }}>
                  <select style={{ flex: 1 }} value={formData.severity} onChange={(e) => setFormData({...formData, severity: e.target.value})}>
                    <option value="Trivial">Trivial</option>
                    <option value="Minor">Minor</option>
                    <option value="Major">Major</option>
                    <option value="Critical">Critical</option>
                  </select>
                  <select style={{ flex: 1 }} value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})}>
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                  </select>
                </div>

                <div className="file-upload-wrapper" style={{ marginTop: '8px', marginBottom: '8px' }}>
                  <label htmlFor="bug-image" style={{display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)'}}>Attach Image (Optional)</label>
                  <input 
                    type="file" 
                    id="bug-image"
                    accept="image/*"
                    onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
                    style={{ 
                      padding: '12px 16px', 
                      border: '1px dashed var(--border-color)', 
                      borderRadius: '8px', 
                      backgroundColor: 'rgba(255, 255, 255, 0.02)', 
                      width: '100%', 
                      color: 'var(--text-secondary)',
                      cursor: 'pointer' 
                    }}
                  />
                  {formData.image && <p style={{fontSize: '0.8rem', color: 'var(--accent-green)', marginTop: '6px'}}>{formData.image.name} selected</p>}
                </div>

                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Report Bug"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TesterDashboard;