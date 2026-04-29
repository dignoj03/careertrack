import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function ApplicationForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    company: "",
    job_title: "",
    location: "",
    job_type: "Full-time",
    status: "Applied",
    date_applied: "",
    job_link: "",
    salary_range: "",
    contact_person: "",
    notes: "",
    follow_up_date: "",
    follow_up_completed: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(isEditMode);

  useEffect(() => {
    async function fetchApplication() {
      if (!isEditMode) return;

      try {
        const response = await api.get(`/applications/${id}`);
        const application = response.data;

        setFormData({
          company: application.company || "",
          job_title: application.job_title || "",
          location: application.location || "",
          job_type: application.job_type || "Full-time",
          status: application.status || "Applied",
          date_applied: application.date_applied || "",
          job_link: application.job_link || "",
          salary_range: application.salary_range || "",
          contact_person: application.contact_person || "",
          notes: application.notes || "",
          follow_up_date: application.follow_up_date || "",
          follow_up_completed: application.follow_up_completed || false,
        });
      } catch (error) {
        console.error("Error loading application:", error);
        setError("Failed to load application.");
      } finally {
        setLoading(false);
      }
    }

    fetchApplication();
  }, [id, isEditMode]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (
      !formData.company ||
      !formData.job_title ||
      !formData.status ||
      !formData.date_applied
    ) {
      setError("Please fill in company, job title, status, and date applied.");
      return;
    }

    try {
      if (isEditMode) {
        await api.put(`/applications/${id}`, formData);
      } else {
        await api.post("/applications/", formData);
      }

      navigate("/applications");
    } catch (error) {
      console.error("Error saving application:", error);
      setError("Failed to save application. Make sure the backend is running.");
    }
  }

  if (loading) {
    return <div className="empty-state">Loading application...</div>;
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {isEditMode ? "Edit Application" : "Add Application"}
          </h1>
          <p className="page-subtitle">
            {isEditMode
              ? "Update job application details and keep your tracker accurate."
              : "Add a new job application and track it through your job search pipeline."}
          </p>
        </div>
      </div>

      <div className="card">
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

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Company Name *</label>
              <input
                className="form-input"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Example: Google"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Job Title *</label>
              <input
                className="form-input"
                name="job_title"
                value={formData.job_title}
                onChange={handleChange}
                placeholder="Example: Software Engineer"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                className="form-input"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Toronto, ON / Remote"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Job Type</label>
              <select
                className="form-select"
                name="job_type"
                value={formData.job_type}
                onChange={handleChange}
              >
                <option>Full-time</option>
                <option>Internship</option>
                <option>Co-op</option>
                <option>Contract</option>
                <option>Remote</option>
                <option>Hybrid</option>
                <option>On-site</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status *</label>
              <select
                className="form-select"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option>Saved</option>
                <option>Applied</option>
                <option>Online Assessment</option>
                <option>Interview</option>
                <option>Offer</option>
                <option>Rejected</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Date Applied *</label>
              <input
                className="form-input"
                type="date"
                name="date_applied"
                value={formData.date_applied}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Job Link</label>
              <input
                className="form-input"
                name="job_link"
                value={formData.job_link}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Salary Range</label>
              <input
                className="form-input"
                name="salary_range"
                value={formData.salary_range}
                onChange={handleChange}
                placeholder="$80,000 - $100,000"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Person</label>
              <input
                className="form-input"
                name="contact_person"
                value={formData.contact_person}
                onChange={handleChange}
                placeholder="Recruiter name or email"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Follow-up Date</label>
              <input
                className="form-input"
                type="date"
                name="follow_up_date"
                value={formData.follow_up_date}
                onChange={handleChange}
              />
            </div>

            <div className="form-group form-full">
              <label
                className="form-label"
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <input
                  type="checkbox"
                  name="follow_up_completed"
                  checked={formData.follow_up_completed}
                  onChange={handleChange}
                />
                Follow-up completed
              </label>
            </div>

            <div className="form-group form-full">
              <label className="form-label">Notes</label>
              <textarea
                className="form-textarea"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add notes about the posting, recruiter, interview prep, or follow-up..."
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate("/applications")}
            >
              Cancel
            </button>

            <button type="submit" className="primary-button">
              {isEditMode ? "Update Application" : "Save Application"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default ApplicationForm;