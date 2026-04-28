import { NavLink, Route, Routes } from "react-router-dom";
import { BarChart3, BriefcaseBusiness, CalendarDays, LayoutDashboard } from "lucide-react";

import Dashboard from "./pages/Dashboard";
import Applications from "./pages/Applications";
import ApplicationForm from "./pages/ApplicationForm";
import Interviews from "./pages/Interviews";

function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-title">CareerTrack</div>
          <div className="logo-subtitle">Job search command center</div>
        </div>

        <nav className="nav-links">
          <NavLink to="/" className="nav-link">
            <LayoutDashboard size={19} />
            Dashboard
          </NavLink>

          <NavLink to="/applications" className="nav-link">
            <BriefcaseBusiness size={19} />
            Applications
          </NavLink>

          <NavLink to="/add-application" className="nav-link">
            <BarChart3 size={19} />
            Add Application
          </NavLink>

          <NavLink to="/interviews" className="nav-link">
            <CalendarDays size={19} />
            Interviews
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-footer-title">Portfolio Project</div>
          <div className="sidebar-footer-text">
            Full-stack React + FastAPI job tracker built by Digno Justin.
          </div>
        </div>
      </aside>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/add-application" element={<ApplicationForm />} />
          <Route path="/interviews" element={<Interviews />} />
          <Route path="/edit-application/:id" element={<ApplicationForm />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;