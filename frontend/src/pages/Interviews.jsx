import { useEffect, useState } from "react";
import api from "../services/api";

function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingInterviewId, setEditingInterviewId] = useState(null);

  const initialFormData = {
    application_id: "",
    interview_type: "Technical",
    interview_date: "",
    interview_time: "",
    interview_status: "Scheduled",
    notes: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState("");

  async function fetchData() {
    try {
      const [interviewsResponse, applicationsResponse] = await Promise.all([
        api.get("/interviews/"),
        api.get("/applications/"),
      ]);

      setInterviews(interviewsResponse.data);
      setApplications(applicationsResponse.data);
    } catch (error) {
      console.error("Error loading interviews:", error);
      setError("Failed to load interviews. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function startEditing(interview) {
    setEditingInterviewId(interview.id);

    setFormData({
      application_id: String(interview.application_id),
      interview_type: interview.interview_type || "Technical",
      interview_date: interview.interview_date || "",
      interview_time: interview.interview_time || "",
      interview_status: interview.interview_status || "Scheduled",
      notes: interview.notes || "",
    });
  }

  function cancelEditing() {
    setEditingInterviewId(null);
    setFormData(initialFormData);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!formData.application_id || !formData.interview_date) {
      setError("Please select an application and interview date.");
      return;
    }

    try {
      const payload = {
        ...formData,
        application_id: Number(formData.application_id),
      };

      if (editingInterviewId) {
        await api.put(`/interviews/${editingInterviewId}`, payload);
      } else {
        await api.post("/interviews/", payload);
      }

      setFormData(initialFormData);
      setEditingInterviewId(null);
      fetchData();
    } catch (error) {
      console.error("Error saving interview:", error);
      setError("Failed to save interview.");
    }
  }

  async function deleteInterview(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this interview?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/interviews/${id}`);
      setInterviews((currentInterviews) =>
        currentInterviews.filter((interview) => interview.id !== id)
      );

      if (editingInterviewId === id) {
        cancelEditing();
      }
    } catch (error) {
      console.error("Error deleting interview:", error);
      setError("Failed to delete interview.");
    }
  }

  function getApplicationName(applicationId) {
    const application = applications.find((app) => app.id === applicationId);

    if (!application) {
      return "Unknown Application";
    }

    return `${application.company} — ${application.job_title}`;
  }

  if (loading) {
    return <div className="empty-state">Loading interviews...</div>;
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Interviews</h1>
          <p className="page-subtitle">
            Track interview rounds, preparation notes, and upcoming dates.
          </p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h2 className="section-title">
            {editingInterviewId ? "Edit Interview" : "Add Interview"}
          </h2>

          {error && (
            <div
              style={{
                background: "#fee2e2",
                color: "#991b1b",
                padding: "12px 14px",
                borderRadius: 12,
                marginBottom: 18,
                fontWeight: 700,
              }}
            >
              {error}
            </div>
          )}

          {applications.length === 0 ? (
            <div className="empty-state">
              Add a job application first before scheduling an interview.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-grid" style={{ gridTemplateColumns: "1fr" }}>
                <div className="form-group">
                  <label className="form-label">Application *</label>
                  <select
                    className="form-select"
                    name="application_id"
                    value={formData.application_id}
                    onChange={handleChange}
                  >
                    <option value="">Select application</option>
                    {applications.map((application) => (
                      <option key={application.id} value={application.id}>
                        {application.company} — {application.job_title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Interview Type</label>
                  <select
                    className="form-select"
                    name="interview_type"
                    value={formData.interview_type}
                    onChange={handleChange}
                  >
                    <option>Phone Screen</option>
                    <option>Technical</option>
                    <option>Behavioral</option>
                    <option>Final</option>
                    <option>HR</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Interview Date *</label>
                  <input
                    className="form-input"
                    type="date"
                    name="interview_date"
                    value={formData.interview_date}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Interview Time</label>
                  <input
                    className="form-input"
                    type="time"
                    name="interview_time"
                    value={formData.interview_time}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    name="interview_status"
                    value={formData.interview_status}
                    onChange={handleChange}
                  >
                    <option>Scheduled</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea
                    className="form-textarea"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Add preparation notes, topics to review, interviewer names, or follow-up reminders..."
                  />
                </div>
              </div>

              <div className="form-actions">
                {editingInterviewId && (
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={cancelEditing}
                  >
                    Cancel Edit
                  </button>
                )}

                <button type="submit" className="primary-button">
                  {editingInterviewId ? "Update Interview" : "Save Interview"}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="card table-card">
          <h2 className="section-title">Scheduled Interviews</h2>

          {interviews.length === 0 ? (
            <div className="empty-state">No interviews scheduled yet.</div>
          ) : (
            <table className="applications-table">
              <thead>
                <tr>
                  <th>Application</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {interviews.map((interview) => (
                  <tr key={interview.id}>
                    <td>{getApplicationName(interview.application_id)}</td>
                    <td>{interview.interview_type}</td>
                    <td>{interview.interview_date}</td>
                    <td>{interview.interview_time || "—"}</td>
                    <td>{interview.interview_status}</td>
                    <td style={{ maxWidth: 220 }}>
                      {interview.notes
                        ? interview.notes.length > 60
                          ? `${interview.notes.slice(0, 60)}...`
                          : interview.notes
                        : "—"}
                    </td>
                    <td>
                      <button
                        className="secondary-button"
                        onClick={() => startEditing(interview)}
                      >
                        Edit
                      </button>{" "}
                      <button
                        className="danger-button"
                        onClick={() => deleteInterview(interview.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default Interviews;