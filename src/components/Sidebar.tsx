import React, { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  GraduationCap,
  ClipboardList,
  BookOpen,
  FileText,
  Settings,
  UserCircle,
  ChevronDown,
  ChevronRight,
  Users,
  Info,
} from "lucide-react";

interface Props {
  role?: "admin" | "teacher" | "student";
}

function Sidebar({
  role = "student",
}: Props) {

  const location = useLocation();
  const navigate = useNavigate();

  // ================= DROPDOWN =================

  const [studentDropdown, setStudentDropdown] =
    useState(false);

  // ================= ACTIVE =================

  const isActive = (path: string) =>
    location.pathname === path;

  // ================= MENU ITEM =================

  const item = (active: boolean) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 14px",
    margin: "6px 0",
    borderRadius: "12px",
    color: active ? "#ffffff" : "#d1d5db",
    textDecoration: "none",
    background: active
      ? "#14b8a6"
      : "transparent",
    transition: "0.3s",
    fontSize: "15px",
    fontWeight: 500,
  });

  return (

    <div style={styles.sidebar}>

      {/* LOGO */}

      <div style={styles.logoContainer}>

        <div style={styles.logoCircle}>
          🎓
        </div>

        <div>
          <div style={styles.logo}>
            Student Panel
          </div>

          <div style={styles.role}>
            {role.toUpperCase()}
          </div>
        </div>

      </div>

      {/* DASHBOARD */}

      <Link
        to="/"
        style={item(isActive("/"))}
      >
        <LayoutDashboard size={18} />
        Dashboard
      </Link>

      {/* ADMIN + TEACHER */}

      {(role === "admin" ||
        role === "teacher") && (
        <>

          {/* STUDENTS DROPDOWN */}

          <div
            style={{
              ...styles.dropdownHeader,
              background:
                location.pathname.includes(
                  "/students"
                ) ||
                location.pathname.includes(
                  "/student-information"
                )
                  ? "#14b8a6"
                  : "transparent",
            }}
            onClick={() =>
              setStudentDropdown(
                !studentDropdown
              )
            }
          >

            <div style={styles.dropdownLeft}>
              <GraduationCap size={18} />
              Students
            </div>

            {studentDropdown ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}

          </div>

          {/* DROPDOWN MENU */}

          {studentDropdown && (

            <div style={styles.dropdownMenu}>

              <div
                style={{
                  ...styles.dropdownItem,
                  background: isActive(
                    "/students"
                  )
                    ? "#14b8a6"
                    : "#1f2937",
                }}
                onClick={() =>
                  navigate("/students")
                }
              >
                <Users size={16} />
                All Students
              </div>

              <div
                style={{
                  ...styles.dropdownItem,
                  background: isActive(
                    "/student-information"
                  )
                    ? "#14b8a6"
                    : "#1f2937",
                }}
                onClick={() =>
                  navigate(
                    "/student-information"
                  )
                }
              >
                <Info size={16} />
                Student Information
              </div>

            </div>

          )}

          {/* ATTENDANCE */}

          <Link
            to="/attendance"
            style={item(
              isActive("/attendance")
            )}
          >
            <ClipboardList size={18} />
            Attendance
          </Link>

          {/* MARKS */}

          <Link
            to="/marks"
            style={item(isActive("/marks"))}
          >
            <FileText size={18} />
            Marks
          </Link>

        </>
      )}

      {/* ASSIGNMENTS */}

      <Link
        to="/assignments"
        style={item(
          isActive("/assignments")
        )}
      >
        <BookOpen size={18} />
        Assignments
      </Link>

      {/* PROFILE */}

      {role === "student" && (

        <Link
          to="/personal-info"
          style={item(
            isActive("/personal-info")
          )}
        >
          <UserCircle size={18} />
          My Profile
        </Link>

      )}

      {/* SETTINGS */}

      <Link
        to="/settings"
        style={item(
          isActive("/settings")
        )}
      >
        <Settings size={18} />
        Settings
      </Link>

    </div>
  );
}

// ================= STYLES =================

const styles: any = {

  sidebar: {
    width: "240px",
    height: "100vh",
    background: "#111827",
    padding: "18px 14px",
    position: "fixed",
    left: 0,
    top: 0,
    color: "white",
    overflowY: "auto",
    boxShadow:
      "4px 0 20px rgba(0,0,0,0.15)",
  },

  logoContainer: {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginTop: "40px",
  marginBottom: "30px",
  padding: "10px",
  borderBottom:
    "1px solid rgba(255,255,255,0.1)",
},

  logoCircle: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    background: "#14b8a6",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "20px",
  },

  logo: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#fff",
  },

  role: {
    fontSize: "12px",
    color: "#9ca3af",
    marginTop: "2px",
  },

  dropdownHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 14px",
    borderRadius: "12px",
    margin: "6px 0",
    cursor: "pointer",
    color: "#fff",
    transition: "0.3s",
    fontSize: "15px",
    fontWeight: 500,
  },

  dropdownLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  dropdownMenu: {
    marginLeft: "12px",
    marginBottom: "10px",
  },

  dropdownItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 12px",
    borderRadius: "10px",
    marginTop: "6px",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    transition: "0.3s",
  },

};

export default Sidebar;