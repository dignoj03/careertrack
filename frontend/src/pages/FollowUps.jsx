import { useEffect, useState } from "react";
import api from "../services/api";
import StatusBadge from "../components/StatusBadge";

function FollowUps() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Pending");

  async function fetchApplications() {
    try {
      const response = await api.get("/applications/");
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching follow-ups:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchApplications();
  }, []);

  async function markCompleted(application) {
    try {
      await api.put(`/applications/${application.id}`, {
        ...application,
        follow_up_completed: true,
      });

      fetchApplications();
    } catch (error) {
      console.error("Error updating follow-up:", error);
    }
  }

  const followUps = applications
    .filter((application) => application.follow_up_date)
    .filter((application) => {
      if (filter === "Pending") {
        return !application.follow_up_completed;
      }

      if (filter === "Completed") {
        return application.follow_up_completed;
      }

      return true;
    })
    .sort((a, b) => new Date(a.follow_up_date) - new Date(b.follow_up_date));

  function getFollowUpStatus(application) {
    const today = new Date().toISOString().split("T")[0];

    if (application.follow_up_completed) {
      return "Completed";
    }

    if (application.follow_up_date < today) {
      return "Overdue";
    }

    if (application.follow_up_date === today) {
      return "Due Today";
    }

    return "Upcoming";
  }

  function getFollowUpStyle(status) {
    if (status === "Completed") {
      return {
        background: "#dcfce7",
        color: "#15803d",
      };
    }

    if (status === "Overdue") {
      return {
        background: "#fee2e2",
        color: "#b91c1c",
      };
    }

    if (status === "Due Today") {
      return {
        background: "#fef3c7",
        color: "#b45309",
      };
    }

    return {
      background: "#dbeafe",
      color: "#1d4ed8",
    };
  }

  if (loading) {
    return <div className="empty-state">Loading follow-ups...</div>;
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Follow-Ups</h1>
          <p className="page-subtitle">
            Keep track of applications that need a recruiter follow-up.
          </p>
        </div>

        <select
          className="filter-select"
          style={{ maxWidth: 220 }}
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option>Pending</option>
          <option>Completed</option>
          <option>All</option>
        </select>
      </div>

      <div className="card table-card">
        {followUps.length === 0 ? (
          <div className="empty-state">
            No follow-ups found for this filter.
          </div>
        ) : (
          <table className="applications-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Status</th>
                <th>Follow-Up Date</th>
                <th>Follow-Up Status</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {followUps.map((application) => {
                const followUpStatus = getFollowUpStatus(application);
                const style = getFollowUpStyle(followUpStatus);

                return (
                  <tr key={application.id}>
                    <td>
                      <div className="company-name">{application.company}</div>
                      <div className="job-title">{application.job_title}</div>
                    </td>

                    <td>
                      <StatusBadge status={application.status} />
                    </td>

                    <td>{application.follow_up_date}</td>

                    <td>
                      <span
                        className="status-badge"
                        style={{
                          background: style.background,
                          color: style.color,
                        }}
                      >
                        {followUpStatus}
                      </span>
                    </td>

                    <td style={{ maxWidth: 240 }}>
                      {application.notes
                        ? application.notes.length > 70
                          ? `${application.notes.slice(0, 70)}...`
                          : application.notes
                        : "—"}
                    </td>

                    <td>
                      {!application.follow_up_completed ? (
                        <button
                          className="secondary-button"
                          onClick={() => markCompleted(application)}
                        >
                          Mark Complete
                        </button>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default FollowUps;