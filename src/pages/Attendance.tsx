import React, { useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  Save,
  Search,
  Users,
  UserCheck,
  UserX,
  Percent,
} from "lucide-react";

import { addAttendance } from "../services/api";
import { Student } from "../types/Student";

interface Props {
  students: Student[];
  loadAttendance: () => void;
}

const Attendance: React.FC<Props> = ({
  students,
  loadAttendance,
}) => {
  const [attendanceData, setAttendanceData] =
    useState<Record<string, boolean>>({});

  const [courseFilter, setCourseFilter] =
    useState("");

  const [search, setSearch] = useState("");

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const normalizeCourse = (course: string) =>
    (course || "")
      .toUpperCase()
      .replace(/\s/g, "")
      .replace(/\./g, "");

  const filteredStudents = useMemo(() => {
    return (students || [])
      .filter((student) => {
        const matchCourse = courseFilter
          ? normalizeCourse(
              String(student.course)
            ) ===
            normalizeCourse(courseFilter)
          : true;

        const query = search.toLowerCase();

        const matchSearch =
          student.name
            .toLowerCase()
            .includes(query) ||
          String(student.rollno || "")
            .toLowerCase()
            .includes(query);

        return matchCourse && matchSearch;
      })
      .sort((a, b) =>
        a.name.localeCompare(b.name)
      );
  }, [students, courseFilter, search]);

  const groupedStudents = useMemo(() => {
    const map: Record<string, Student[]> = {};

    filteredStudents.forEach((student) => {
      const key = student.name
        .trim()
        .toLowerCase();

      if (!map[key]) map[key] = [];

      map[key].push(student);
    });

    return Object.values(map);
  }, [filteredStudents]);

  const repeatedStartingNames = useMemo(() => {
    const counts: Record<string, number> = {};

    filteredStudents.forEach((student) => {
      const startName = getStartingName(
        student.name
      );

      if (!startName) return;

      counts[startName] =
        (counts[startName] || 0) + 1;
    });

    return new Set(
      Object.keys(counts).filter(
        (name) => counts[name] > 1
      )
    );
  }, [filteredStudents]);

  const isPresent = (id?: number) => {
    if (!id) return false;

    return attendanceData[`${id}|${today}`] || false;
  };

  const toggleAttendance = (id?: number) => {
    if (!id) return;

    const key = `${id}|${today}`;

    setAttendanceData((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const totalStudents = filteredStudents.length;

  const presentStudents =
    filteredStudents.filter((student) =>
      isPresent(student.id)
    ).length;

  const absentStudents =
    totalStudents - presentStudents;

  const attendancePercentage =
    totalStudents > 0
      ? (
          (presentStudents / totalStudents) *
          100
        ).toFixed(1)
      : "0";

  const handleSaveAll = async () => {
    const payload = filteredStudents.map(
      (student) => ({
        student_id: student.id,
        student_name: student.name,
        rollno: student.rollno || "",
        date: today,
        status: isPresent(student.id)
          ? "Present"
          : "Absent",
      })
    );

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
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>
            Attendance System
          </h1>

          <p style={styles.pageSubtitle}>
            Manage daily student attendance
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          style={styles.saveBtn}
        >
          <Save size={17} />
          Save Attendance
        </button>
      </div>

      {/* STATS */}
      <div style={styles.statsGrid}>
        <StatCard
          title="Total Students"
          value={String(totalStudents)}
          icon={<Users size={22} />}
          orange
        />

        <StatCard
          title="Present Students"
          value={String(presentStudents)}
          icon={<UserCheck size={22} />}
          green
        />

        <StatCard
          title="Absent Students"
          value={String(absentStudents)}
          icon={<UserX size={22} />}
          red
        />

        <StatCard
          title="Attendance %"
          value={`${attendancePercentage}%`}
          icon={<Percent size={22} />}
          blue
        />
      </div>

      {/* FILTER */}
      <div style={styles.filterCard}>
        <div style={styles.searchWrapper}>
          <Search
            size={18}
            color="#64748b"
          />

          <input
            type="text"
            placeholder="Search student..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            style={styles.searchInput}
          />
        </div>

        <select
          value={courseFilter}
          onChange={(e) =>
            setCourseFilter(e.target.value)
          }
          style={styles.select}
        >
          <option value="">
            All Courses
          </option>

          <option value="E.C.E">
            E.C.E
          </option>

          <option value="E.E.E">
            E.E.E
          </option>

          <option value="C.S.E">
            C.S.E
          </option>

          <option value="CIVIL">
            CIVIL
          </option>

          <option value="MECHANICAL">
            MECHANICAL
          </option>
        </select>
      </div>

      {/* STUDENTS */}
      <div style={styles.attendanceGrid}>
        {groupedStudents.map(
          (group, index) => {
            const mainStudent = group[0];

            const checked = isPresent(
              mainStudent.id
            );

            const showRollNo =
              repeatedStartingNames.has(
                getStartingName(
                  mainStudent.name
                )
              );

            const rollText =
              group.length > 1
                ? group
                    .map((student) =>
                      getRollNo(student)
                    )
                    .join(", ")
                : getRollNo(mainStudent);

            return (
              <div
                key={index}
                style={{
                  ...styles.studentCard,
                  borderColor: checked
                    ? "#16a34a"
                    : "#e2e8f0",
                  background: checked
                    ? "#ecfdf5"
                    : "#fff",
                }}
              >
                <div style={styles.studentInfo}>
                  <div
                    style={
                      styles.studentName
                    }
                  >
                    {mainStudent.name}
                  </div>

                  {showRollNo && (
                    <div
                      style={
                        styles.rollText
                      }
                    >
                      Roll No: {rollText}
                    </div>
                  )}
                </div>

                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    toggleAttendance(
                      mainStudent.id
                    )
                  }
                  style={styles.checkbox}
                />
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  icon,
  orange,
  green,
  red,
  blue,
}: any) => {
  let bg = "#fff";

  if (orange)
    bg = "rgb(239 138 22)";

  if (green)
    bg = "#127474";

  if (red)
    bg = "rgb(143 177 77 / 92%)";

  if (blue)
    bg = "#7389b9";

  return (
    <div
      style={{
        ...styles.statCard,
        background: bg,
      }}
    >
      <div style={styles.iconBox}>
        {icon}
      </div>

      <div>
        <div style={styles.statTitle}>
          {title}
        </div>

        <div style={styles.statValue}>
          {value}
        </div>
      </div>
    </div>
  );
};

const getRollNo = (student: any) =>
  student.rollno ||
  student.roll_no ||
  student.rollNo ||
  "-";

const getStartingName = (
  name = ""
) =>
  name
    .trim()
    .split(/\s+/)[0]
    ?.toLowerCase() || "";

const styles: any = {
  page: {
    padding: 24,
    background:
      "linear-gradient(to bottom right,#f8fafc,#eef2ff)",
    minHeight: "100vh",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 24,
  },

  pageTitle: {
    margin: 0,
    fontSize: 30,
    fontWeight: 700,
    color: "#172033",
  },

  pageSubtitle: {
    marginTop: 6,
    color: "#667085",
    fontSize: 15,
  },

  saveBtn: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    border: "none",
    borderRadius: 12,
    padding: "14px 22px",
    background:
      "linear-gradient(135deg,#2563eb,#1d4ed8)",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 15,
    boxShadow:
      "0 8px 20px rgba(37,99,235,0.25)",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: 18,
    marginBottom: 24,
  },

  statCard: {
    borderRadius: 18,
    padding: 22,
    display: "flex",
    alignItems: "center",
    gap: 16,
    color: "#fff",
    boxShadow:
      "0 10px 24px rgba(0,0,0,0.12)",
  },

  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    background:
      "rgba(255,255,255,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    flexShrink: 0,
  },

  statTitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    marginBottom: 6,
    fontWeight: 500,
  },

  statValue: {
    color: "#fff",
    fontSize: 28,
    fontWeight: 700,
  },

  filterCard: {
    background: "#fff",
    borderRadius: 18,
    padding: 20,
    display: "flex",
    gap: 16,
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 24,
    boxShadow:
      "0 4px 18px rgba(15,23,42,0.06)",
  },

  searchWrapper: {
    flex: 1,
    minWidth: 240,
    display: "flex",
    alignItems: "center",
    gap: 10,
    border: "1px solid #dbe3ee",
    borderRadius: 12,
    padding: "0 14px",
    background: "#f9fafb",
  },

  searchInput: {
    width: "100%",
    border: "none",
    outline: "none",
    padding: "14px 0",
    background: "transparent",
    fontSize: 14,
  },

  select: {
    minWidth: 190,
    borderRadius: 12,
    border: "1px solid #dbe3ee",
    padding: 14,
    outline: "none",
    background: "#f9fafb",
    fontSize: 14,
    color: "#111827",
  },

  // UPDATED GRID FOR 5-6 STUDENTS PER ROW
  attendanceGrid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fill,minmax(180px,1fr))",

    gap: 12,

    alignItems: "stretch",
  },

  // COMPACT STUDENT CARD
  studentCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",

    gap: 8,

    padding: "12px 14px",

    border: "1px solid #dce4ec",

    borderRadius: 14,

    transition: "0.3s",

    boxShadow:
      "0 2px 10px rgba(0,0,0,0.05)",

    minHeight: 72,
  },

  studentInfo: {
    flex: 1,
    minWidth: 0,
  },

  studentName: {
    color: "#172033",
    fontSize: 13,
    fontWeight: 700,
    lineHeight: "18px",
    overflowWrap: "anywhere",
  },

  rollText: {
    marginTop: 4,
    color: "#2563eb",
    fontSize: 11,
    fontWeight: 500,
  },

  checkbox: {
    width: 18,
    height: 18,
    cursor: "pointer",
    accentColor: "#16a34a",
    flexShrink: 0,
  },
};

export default Attendance;