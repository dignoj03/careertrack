import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileText,
  Send,
  XCircle,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import api from "../services/api";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";

function Dashboard() {
  const [stats, setStats] = useState({
    total_applications: 0,
    applications_this_month: 0,
    interviews: 0,
    offers: 0,
    rejections: 0,
    response_rate: 0,
    follow_ups_due: 0,
    saved_jobs: 0,
    status_breakdown: [],
    recent_applications: [],
    upcoming_interviews: [],
  });

  const [loading, setLoading] = useState(true);

  async function fetchDashboardStats() {
    try {
      const response = await api.get("/dashboard/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) {
    return <div className="empty-state">Loading dashboard...</div>;
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Track applications, interviews, follow-ups, and outcomes in one place.
          </p>
        </div>

        <Link to="/add-application">
          <button className="primary-button">+ Add Application</button>
        </Link>
      </div>

      <div className="stats-grid">
        <StatCard
          label="Total Applications"
          value={stats.total_applications}
          icon={<BriefcaseBusiness size={22} />}
        />

        <StatCard
          label="This Month"
          value={stats.applications_this_month}
          icon={<Send size={22} />}
        />

        <StatCard
          label="Interviews"
          value={stats.interviews}
          icon={<CalendarClock size={22} />}
        />

        <StatCard
          label="Offers"
          value={stats.offers}
          icon={<Award size={22} />}
        />

        <StatCard
          label="Rejections"
          value={stats.rejections}
          icon={<XCircle size={22} />}
        />

        <StatCard
          label="Response Rate"
          value={`${stats.response_rate}%`}
          icon={<CheckCircle2 size={22} />}
        />

        <StatCard
          label="Follow-ups Due"
          value={stats.follow_ups_due}
          icon={<Clock3 size={22} />}
        />

        <StatCard
          label="Saved Jobs"
          value={stats.saved_jobs}
          icon={<FileText size={22} />}
        />
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h2 className="section-title">Applications by Status</h2>

          {stats.status_breakdown.length === 0 ? (
            <div className="empty-state">
              No chart data yet. Add applications to see your status breakdown.
            </div>
          ) : (
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <BarChart data={stats.status_breakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4f46e5" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="section-title">Upcoming Interviews</h2>

          {stats.upcoming_interviews.length === 0 ? (
            <div className="empty-state">
              No upcoming interviews scheduled.
            </div>
          ) : (
            stats.upcoming_interviews.map((interview) => (
              <div
                key={interview.id}
                style={{
                  padding: "14px 0",
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                <div className="company-name">{interview.company}</div>
                <div className="job-title">{interview.job_title}</div>

                <div style={{ marginTop: 8, color: "#374151", fontSize: 14 }}>
                  {interview.interview_type} • {interview.interview_date}
                  {interview.interview_time
                    ? ` at ${interview.interview_time}`
                    : ""}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <h2 className="section-title">Recent Applications</h2>

        {stats.recent_applications.length === 0 ? (
          <div className="empty-state">No recent applications yet.</div>
        ) : (
          <table className="applications-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Status</th>
                <th>Date Applied</th>
              </tr>
            </thead>

            <tbody>
              {stats.recent_applications.map((application) => (
                <tr key={application.id}>
                  <td>
                    <div className="company-name">{application.company}</div>
                    <div className="job-title">{application.job_title}</div>
                  </td>
                  <td>
                    <StatusBadge status={application.status} />
                  </td>
                  <td>{application.date_applied}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default Dashboard;