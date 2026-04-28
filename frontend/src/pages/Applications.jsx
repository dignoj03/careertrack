import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import StatusBadge from "../components/StatusBadge";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [sortOption, setSortOption] = useState("newest");
  const [loading, setLoading] = useState(true);

  async function fetchApplications() {
    try {
      const response = await api.get("/applications/");
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteApplication(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/applications/${id}`);
      setApplications((currentApplications) =>
        currentApplications.filter((application) => application.id !== id)
      );
    } catch (error) {
      console.error("Error deleting application:", error);
    }
  }

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredApplications = applications
    .filter((application) => {
      const company = application.company.toLowerCase();
      const jobTitle = application.job_title.toLowerCase();
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        company.includes(search) || jobTitle.includes(search);

      const matchesStatus =
        statusFilter === "All Statuses" || application.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortOption === "newest") {
        return new Date(b.date_applied) - new Date(a.date_applied);
      }

      if (sortOption === "oldest") {
        return new Date(a.date_applied) - new Date(b.date_applied);
      }

      if (sortOption === "company") {
        return a.company.localeCompare(b.company);
      }

      if (sortOption === "status") {
        return a.status.localeCompare(b.status);
      }

      return 0;
    });

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Applications</h1>
          <p className="page-subtitle">
            Manage your job applications, statuses, dates, links, and notes.
          </p>
        </div>

        <Link to="/add-application">
          <button className="primary-button">+ Add Application</button>
        </Link>
      </div>

      <div className="card table-card">
        <div className="table-toolbar">
          <input
            className="search-input"
            placeholder="Search by company or job title..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <select
            className="filter-select"
            style={{ maxWidth: 220 }}
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option>All Statuses</option>
            <option>Saved</option>
            <option>Applied</option>
            <option>Online Assessment</option>
            <option>Interview</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>

          <select
            className="filter-select"
            style={{ maxWidth: 220 }}
            value={sortOption}
            onChange={(event) => setSortOption(event.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="company">Company A-Z</option>
            <option value="status">Status A-Z</option>
          </select>
        </div>

        {loading ? (
          <div className="empty-state">Loading applications...</div>
        ) : filteredApplications.length === 0 ? (
          <div className="empty-state">
            No applications found. Add your first application to get started.
          </div>
        ) : (
          <table className="applications-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Location</th>
                <th>Job Type</th>
                <th>Status</th>
                <th>Date Applied</th>
                <th>Job Link</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredApplications.map((application) => (
                <tr key={application.id}>
                  <td>
                    <div className="company-name">{application.company}</div>
                    <div className="job-title">{application.job_title}</div>
                  </td>

                  <td>{application.location || "—"}</td>

                  <td>{application.job_type || "—"}</td>

                  <td>
                    <StatusBadge status={application.status} />
                  </td>

                  <td>{application.date_applied}</td>

                  <td>
                    {application.job_link ? (
                      <a
                        href={application.job_link}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: "#4f46e5",
                          fontWeight: 700,
                        }}
                      >
                        View Posting
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>

                  <td style={{ maxWidth: 220 }}>
                    {application.notes
                      ? application.notes.length > 60
                        ? `${application.notes.slice(0, 60)}...`
                        : application.notes
                      : "—"}
                  </td>

                  <td>
                    <Link to={`/edit-application/${application.id}`}>
                      <button className="secondary-button">Edit</button>
                    </Link>{" "}
                    <button
                      className="danger-button"
                      onClick={() => deleteApplication(application.id)}
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
    </>
  );
}

export default Applications;