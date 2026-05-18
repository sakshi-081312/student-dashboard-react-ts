import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  LayoutDashboard,
  GraduationCap,
  ClipboardList,
  BookOpen,
  FileText,
  Settings,
  UserCircle,
  LogOut,
} from "lucide-react";

interface Props {
  role?: "admin" | "teacher" | "student";
}

function Sidebar({ role = "student" }: Props) {
  const location = useLocation();
  const { logout } = useAuth();

  const itemClass = (path: string) =>
    `sidebar-item ${location.pathname === path ? "active-link" : ""}`;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">S</div>
        <div>
          <div className="sidebar-title">Student Panel</div>
          <div className="sidebar-role">{role.toUpperCase()}</div>
        </div>
      </div>

      <nav className="sidebar-menu" aria-label="Main menu">
        <Link to="/" className={itemClass("/")}>
          <LayoutDashboard size={18} />
          <span className="sidebar-text">Dashboard</span>
        </Link>

        {(role === "admin" || role === "teacher") && (
          <Link to="/students" className={itemClass("/students")}>
            <GraduationCap size={18} />
            <span className="sidebar-text">Students</span>
          </Link>
        )}

        {(role === "admin" || role === "teacher") && (
          <Link to="/attendance" className={itemClass("/attendance")}>
            <ClipboardList size={18} />
            <span className="sidebar-text">Attendance</span>
          </Link>
        )}

        {(role === "admin" || role === "teacher") && (
          <Link to="/marks" className={itemClass("/marks")}>
            <FileText size={18} />
            <span className="sidebar-text">Marks</span>
          </Link>
        )}

        <Link to="/assignments" className={itemClass("/assignments")}>
          <BookOpen size={18} />
          <span className="sidebar-text">Assignments</span>
        </Link>

        {role === "student" && (
          <Link to="/personal-info" className={itemClass("/personal-info")}>
            <UserCircle size={18} />
            <span className="sidebar-text">My Profile</span>
          </Link>
        )}

        <Link to="/settings" className={itemClass("/settings")}>
          <Settings size={18} />
          <span className="sidebar-text">Settings</span>
        </Link>
      </nav>

      <div className="logout-container">
        <button onClick={logout} className="logout-btn">
          <LogOut size={18} />
          <span className="logout-text">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
