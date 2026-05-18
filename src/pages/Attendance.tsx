import React, { useMemo, useState } from "react";
import Swal from "sweetalert2";

import { addAttendance } from "../services/api";
import { Student } from "../types/Student";

interface Props {
  students: Student[];
  loadAttendance: () => void;
}

const Attendance: React.FC<Props> = ({ students, loadAttendance }) => {
  const [attendanceData, setAttendanceData] = useState<Record<string, boolean>>({});
  const [courseFilter, setCourseFilter] = useState("");
  const [search, setSearch] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const normalizeCourse = (course: string) =>
    (course || "").toUpperCase().replace(/\s/g, "").replace(/\./g, "");

  const filteredStudents = useMemo(() => {
    return (students || [])
      .filter((student) => {
        const matchCourse = courseFilter
          ? normalizeCourse(String(student.course)) === normalizeCourse(courseFilter)
          : true;

        const query = search.toLowerCase();
        const matchSearch =
          student.name.toLowerCase().includes(query) ||
          String(student.rollno || "").toLowerCase().includes(query);

        return matchCourse && matchSearch;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [students, courseFilter, search]);

  const groupedStudents = useMemo(() => {
    const map: Record<string, Student[]> = {};

    filteredStudents.forEach((student) => {
      const key = student.name.trim().toLowerCase();
      if (!map[key]) map[key] = [];
      map[key].push(student);
    });

    return Object.values(map);
  }, [filteredStudents]);

  const repeatedStartingNames = useMemo(() => {
    const counts: Record<string, number> = {};

    filteredStudents.forEach((student) => {
      const startName = getStartingName(student.name);
      if (!startName) return;
      counts[startName] = (counts[startName] || 0) + 1;
    });

    return new Set(Object.keys(counts).filter((name) => counts[name] > 1));
  }, [filteredStudents]);

  const isPresent = (id?: number) => {
    if (!id) return false;
    return attendanceData[`${id}|${today}`] || false;
  };

  const toggleAttendance = (id?: number) => {
    if (!id) return;
    const key = `${id}|${today}`;
    setAttendanceData((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const totalStudents = filteredStudents.length;
  const presentStudents = filteredStudents.filter((student) => isPresent(student.id)).length;
  const absentStudents = totalStudents - presentStudents;
  const attendancePercentage =
    totalStudents > 0 ? ((presentStudents / totalStudents) * 100).toFixed(1) : "0";

  const handleSaveAll = async () => {
    const payload = filteredStudents.map((student) => ({
      student_id: student.id,
      student_name: student.name,
      rollno: student.rollno || "",
      date: today,
      status: isPresent(student.id) ? "Present" : "Absent",
    }));

    try {
      await addAttendance(payload);

      Swal.fire({
        icon: "success",
        title: "Attendance Saved",
        timer: 1500,
        showConfirmButton: false,
      });

      loadAttendance();
    } catch {
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
      });
    }
  };

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">Attendance System</h1>
          <p className="page-subtitle">Manage daily student attendance</p>
        </div>

        <button onClick={handleSaveAll} className="add-btn">
          Save Attendance
        </button>
      </div>

      <div className="responsive-stats">
        <StatCard title="Total" value={String(totalStudents)} />
        <StatCard title="Present" value={String(presentStudents)} green />
        <StatCard title="Absent" value={String(absentStudents)} red />
        <StatCard title="Attendance %" value={`${attendancePercentage}%`} blue />
      </div>

      <div className="form-card">
        <input
          type="text"
          placeholder="Search student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />

        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          style={styles.select}
        >
          <option value="">All Courses</option>
          <option value="E.C.E">E.C.E</option>
          <option value="E.E.E">E.E.E</option>
          <option value="C.S.E">C.S.E</option>
          <option value="CIVIL">CIVIL</option>
          <option value="MECHANICAL">MECHANICAL</option>
        </select>
      </div>

      <div className="attendance-grid">
        {groupedStudents.map((group, index) => {
          const mainStudent = group[0];
          const checked = isPresent(mainStudent.id);
          const showRollNo = repeatedStartingNames.has(getStartingName(mainStudent.name));
          const rollText =
            group.length > 1
              ? group.map((student) => getRollNo(student)).join(", ")
              : getRollNo(mainStudent);

          return (
            <div
              key={index}
              style={{
                ...styles.studentCard,
                borderColor: checked ? "#0f766e" : "#dce4ec",
                background: checked ? "#ecfdf5" : "#fff",
              }}
            >
              <div style={styles.studentInfo}>
                <div style={styles.studentName}>{mainStudent.name}</div>

                {showRollNo && <div style={styles.rollText}>Roll No: {rollText}</div>}
              </div>

              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleAttendance(mainStudent.id)}
                style={styles.checkbox}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, green, red, blue }: any) => {
  let bg = "#fff";
  if (green) bg = "#ecfdf5";
  if (red) bg = "#fef2f2";
  if (blue) bg = "#eff6ff";

  return (
    <div style={{ ...styles.statCard, background: bg }}>
      <div style={styles.statTitle}>{title}</div>
      <div style={styles.statValue}>{value}</div>
    </div>
  );
};

const getRollNo = (student: any) =>
  student.rollno || student.roll_no || student.rollNo || "-";

const getStartingName = (name = "") =>
  name.trim().split(/\s+/)[0]?.toLowerCase() || "";

const styles: any = {
  searchInput: {
    flex: "1 1 240px",
    minWidth: 180,
    padding: 12,
    borderRadius: 8,
    border: "1px solid #dce4ec",
    outline: "none",
  },
  select: {
    flex: "0 1 190px",
    minWidth: 170,
    padding: "12px 14px",
    borderRadius: 8,
    border: "1px solid #dce4ec",
    outline: "none",
  },
  studentCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
    minHeight: 46,
    padding: "6px 7px",
    border: "1px solid #dce4ec",
    borderRadius: 8,
  },
  studentInfo: {
    flex: 1,
    minWidth: 0,
  },
  studentName: {
    color: "#172033",
    fontSize: 12,
    fontWeight: 700,
    lineHeight: "15px",
    overflowWrap: "anywhere",
  },
  rollText: {
    marginTop: 2,
    color: "#667085",
    fontSize: 10,
    lineHeight: "12px",
  },
  checkbox: {
    width: 16,
    height: 16,
    cursor: "pointer",
    flexShrink: 0,
  },
  statCard: {
    border: "1px solid #dce4ec",
    borderRadius: 8,
    padding: 18,
  },
  statTitle: {
    color: "#667085",
    fontSize: 13,
    marginBottom: 6,
  },
  statValue: {
    color: "#172033",
    fontSize: 28,
    fontWeight: 700,
  },
};

export default Attendance;
