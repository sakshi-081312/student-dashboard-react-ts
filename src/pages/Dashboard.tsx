import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { Student } from "../types/Student";

interface Props {
  students: Student[];
  attendance: any[];
  assignments: any[];
  marks: any[];
  role?: "admin" | "teacher" | "student"; // ✅ FIXED (optional)
}

const COLORS = ["#4f46e5", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4"];

const Dashboard: React.FC<Props> = ({
  students = [],
  attendance = [],
  assignments = [],
  marks = [],
  role = "student", // ✅ default value
}) => {
  const safeStudents = Array.isArray(students) ? students : [];
  const safeAttendance = Array.isArray(attendance) ? attendance : [];
  const safeAssignments = Array.isArray(assignments) ? assignments : [];
  const safeMarks = Array.isArray(marks) ? marks : [];

  // ✅ Course wise students
  const courseData = useMemo(() => {
    const map: Record<string, number> = {};

    safeStudents.forEach((s) => {
      const course = s.course || "Unknown Course";
      map[course] = (map[course] || 0) + 1;
    });

    return Object.keys(map).map((key) => ({
      name: key,
      students: map[key],
    }));
  }, [safeStudents]);

  const attendanceData = useMemo(() => {
    return safeAttendance.map((a) => ({
      name: a.date || "N/A",
      present: a.present || 0,
      absent: a.absent || 0,
    }));
  }, [safeAttendance]);

  const marksData = useMemo(() => {
    return safeMarks.map((m) => ({
      name: m.subject || m.course || "Subject",
      marks: m.score || 0,
    }));
  }, [safeMarks]);

  const assignmentData = useMemo(() => {
    const completed = safeAssignments.filter(
      (a) => a.status === "completed"
    ).length;

    const pending = safeAssignments.length - completed;

    return [
      { name: "Completed", value: completed },
      { name: "Pending", value: pending },
    ];
  }, [safeAssignments]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Student Management Dashboard ({role})</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 20,
        }}
      >
        {/* COURSE CHART */}
        <div style={{ height: 300 }}>
          <h3>Students per Course</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={courseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="students" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ATTENDANCE */}
        <div style={{ height: 300 }}>
          <h3>Attendance</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="present" stroke="#22c55e" />
              <Line type="monotone" dataKey="absent" stroke="#ef4444" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* MARKS */}
        <div style={{ height: 300 }}>
          <h3>Marks</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={marksData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="marks" fill="#06b6d4" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ASSIGNMENTS */}
        <div style={{ height: 300 }}>
          <h3>Assignments</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={assignmentData} dataKey="value" nameKey="name" outerRadius={100} label>
                {assignmentData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;