import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";


import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Students from "./pages/students";
import Attendance from "./pages/Attendance";
import Assignments from "./pages/Assignments";
import Marks from "./pages/Marks";
import Settings from "./pages/settings";
import StudentInformation from "./pages/studentInformation";
import PersonalInfo from "./pages/personalinfo"; 
import Login from "./pages/login";
import MyProfile from "./pages/Myprofile";

import {
  getStudents,
  getAttendance,
  getAssignments,
  getMarks
} from "./services/api";

import { Student } from "./types/Student";
import { useAuth } from "./context/AuthContext";

import "./App.css";

function App() {

  // ================= AUTH =================
  const { user, loading: authLoading } = useAuth();

  const role: "admin" | "teacher" | "student" =
    user?.role || "student";

  // ================= DATA =================
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [marks, setMarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ================= LOAD DATA =================
  const loadAllData = async () => {
    setLoading(true);

    try {
      const [studentsRes, attendanceRes, assignmentsRes, marksRes] =
        await Promise.all([
          getStudents(),
          getAttendance(),
          getAssignments(),
          getMarks()
        ]);

      setStudents(studentsRes || []);
      setAttendance(attendanceRes || []);
      setAssignments(assignmentsRes || []);
      setMarks(marksRes || []);

    } catch (error) {
      console.error("Load Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ================= INIT =================
  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user]);

  // ================= AUTH LOADING =================
  if (authLoading) {
    return (
      <h3 style={{ textAlign: "center" }}>
        Checking authentication...
      </h3>
    );
  }

  // ================= NOT LOGGED IN =================
  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <div className="app-container">

      

      <div className="layout">

        <Sidebar role={role} />

        <div className="main-container">

          <Routes>

            {/* ================= DASHBOARD ================= */}
            <Route
              path="/"
              element={
                loading ? (
                  <h3>Loading dashboard...</h3>
                ) : (
                  <Dashboard
                    students={students}
                    attendance={attendance}
                    assignments={assignments}
                    marks={marks}
                    role={role}
                  />
                )
              }
            />

            {/* ================= STUDENTS ================= */}
            <Route
              path="/students"
              element={
                <Students
                  students={students}
                  loadStudents={loadAllData}
                />
              }
            />

            {/* ================= ATTENDANCE ================= */}
            <Route
              path="/attendance"
              element={
                <Attendance
                  students={students}
                  loadAttendance={loadAllData}
                />
              }
            />

            {/* ================= ASSIGNMENTS ================= */}
            <Route
              path="/assignments"
              element={
                <Assignments
                  students={students}
                  loadAssignments={loadAllData}
                />
              }
            />

            {/* ================= MARKS ================= */}
            <Route
              path="/marks"
              element={
                <Marks
                  students={students}
                  loadMarks={loadAllData}
                />
              }
            />

            {/* ================= STUDENT INFORMATION ================= */}
            <Route
              path="/student-information"
              element={
                <StudentInformation
                  students={students}
                  attendance={attendance}
                  assignments={assignments}
                  marks={marks}
                />
              }
            />

            {/* ================= PERSONAL INFO (NEW) ================= */}
            <Route
              path="/personal-info"
              element={
                <PersonalInfo />
              }
            />
            {/* ================= MY PROFILE ================= */}
<Route
  path="/my-profile"
  element={<MyProfile />}
/>

            {/* ================= SETTINGS ================= */}
            <Route
              path="/settings"
              element={<Settings />}
            />

            {/* ================= FALLBACK ================= */}
            <Route path="*" element={<Navigate to="/" />} />

          </Routes>

        </div>
      </div>
    </div>
  );
}

export default App;