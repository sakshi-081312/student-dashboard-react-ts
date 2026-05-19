import React, { useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  Save,
  Search,
  Users,
  ClipboardCheck,
  Trophy,
} from "lucide-react";

import { addAssignment } from "../services/api";

interface Props {
  students: any[];
  loadAssignments: () => void;
}

const Assignments: React.FC<Props> = ({
  students,
  loadAssignments,
}) => {
  const [marksData, setMarksData] =
    useState<any>({});

  const [search, setSearch] =
    useState("");

  const [courseFilter, setCourseFilter] =
    useState("");

  const filteredStudents = useMemo(() => {
    return (students || [])
      .filter((student) => {
        const query =
          search.toLowerCase();

        const matchSearch =
          student.name
            ?.toLowerCase()
            .includes(query) ||
          String(
            student.rollno || ""
          )
            .toLowerCase()
            .includes(query);

        const matchCourse =
          courseFilter
            ? student.course ===
              courseFilter
            : true;

        return (
          matchSearch &&
          matchCourse
        );
      })
      .sort((a, b) =>
        a.name.localeCompare(
          b.name
        )
      );
  }, [
    students,
    search,
    courseFilter,
  ]);

  const handleChange = (
    id: number,
    field: string,
    value: number
  ) => {
    if (value < 0 || value > 100)
      return;

    setMarksData((prev: any) => {
      const updated = {
        ...(prev[id] || {}),
        [field]: value,
      };

      const total =
        Number(
          updated.assignment1 || 0
        ) +
        Number(
          updated.assignment2 || 0
        );

      updated.total_assignment =
        total;

      updated.percentage = (
        (total / 200) *
        100
      ).toFixed(2);

      return {
        ...prev,
        [id]: updated,
      };
    });
  };

  const handleSave = async () => {
    try {
      const payload =
        filteredStudents
          .map((student) => {
            const data =
              marksData[
                student.id
              ];

            if (!data) return null;

            return {
              student_id:
                student.id,
              student_name:
                student.name,
              assignment1:
                data.assignment1 ||
                0,
              assignment2:
                data.assignment2 ||
                0,
              total_assignment:
                data.total_assignment ||
                0,
              percentage:
                Number(
                  data.percentage
                ) || 0,
              submission_date:
                new Date(),
            };
          })
          .filter(Boolean);

      if (payload.length === 0) {
        Swal.fire(
          "Warning",
          "No data to save",
          "warning"
        );

        return;
      }

      await addAssignment(
        payload as any[]
      );

      Swal.fire(
        "Saved!",
        "Assignments saved successfully",
        "success"
      );

      setMarksData({});

      loadAssignments();
    } catch (error) {
      console.log(error);

      Swal.fire(
        "Error",
        "Failed to save",
        "error"
      );
    }
  };

  const completedEntries =
    Object.keys(marksData).length;

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            Assignment Management
          </h1>

          <p style={styles.subtitle}>
            Manage assignment marks
            for all students
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={
            completedEntries === 0
          }
          style={styles.saveBtn}
        >
          <Save size={18} />
          Save Assignments
        </button>
      </div>

      {/* STATS */}
      <div style={styles.statsGrid}>
        <StatCard
          title="Total Students"
          value={String(
            filteredStudents.length
          )}
          icon={<Users />}
          bg="rgb(239 138 22)"
        />

        <StatCard
          title="Completed Entries"
          value={String(
            completedEntries
          )}
          icon={<ClipboardCheck />}
          bg="#127474"
        />

        <StatCard
          title="Maximum Marks"
          value="200"
          icon={<Trophy />}
          bg="#7389b9"
        />
      </div>

      {/* FILTERS */}
      <div style={styles.filterCard}>
        <div style={styles.searchBox}>
          <Search
            size={18}
            color="#64748b"
          />

          <input
            type="text"
            placeholder="Search by name or roll no..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            style={styles.searchInput}
          />
        </div>

        <select
          value={courseFilter}
          onChange={(e) =>
            setCourseFilter(
              e.target.value
            )
          }
          style={styles.select}
        >
          <option value="">
            All Courses
          </option>

          <option value="E.C.E">
            E.C.E
          </option>

          <option value="C.S.E">
            C.S.E
          </option>

          <option value="E.E.E">
            E.E.E
          </option>

          <option value="MECHANICAL">
            MECHANICAL
          </option>

          <option value="CIVIL">
            CIVIL
          </option>
        </select>
      </div>

      {/* TABLE */}
      <div style={styles.tableCard}>
        <div style={styles.tableWrap}>
          <table
            style={styles.table}
          >
            <thead>
              <tr>
                <th style={styles.th}>
                  S.No
                </th>

                <th style={styles.th}>
                  Roll No
                </th>

                <th style={styles.th}>
                  Student Name
                </th>

                <th style={styles.th}>
                  Assignment 1
                </th>

                <th style={styles.th}>
                  Assignment 2
                </th>

                <th style={styles.th}>
                  Total
                </th>

                <th style={styles.th}>
                  Percentage
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map(
                (
                  student,
                  index
                ) => {
                  const data =
                    marksData[
                      student.id
                    ] || {};

                  return (
                    <tr
                      key={
                        student.id
                      }
                      style={
                        styles.tr
                      }
                    >
                      <td
                        style={
                          styles.td
                        }
                      >
                        {index + 1}
                      </td>

                      <td
                        style={
                          styles.td
                        }
                      >
                        {
                          student.rollno
                        }
                      </td>

                      <td
                        style={{
                          ...styles.td,
                          ...styles.nameCell,
                        }}
                      >
                        {
                          student.name
                        }
                      </td>

                      <td
                        style={
                          styles.td
                        }
                      >
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={
                            data.assignment1 ||
                            ""
                          }
                          onChange={(
                            e
                          ) =>
                            handleChange(
                              student.id,
                              "assignment1",
                              e.target
                                .value ===
                                ""
                                ? 0
                                : Number(
                                    e
                                      .target
                                      .value
                                  )
                            )
                          }
                          style={
                            styles.input
                          }
                        />
                      </td>

                      <td
                        style={
                          styles.td
                        }
                      >
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={
                            data.assignment2 ||
                            ""
                          }
                          onChange={(
                            e
                          ) =>
                            handleChange(
                              student.id,
                              "assignment2",
                              e.target
                                .value ===
                                ""
                                ? 0
                                : Number(
                                    e
                                      .target
                                      .value
                                  )
                            )
                          }
                          style={
                            styles.input
                          }
                        />
                      </td>

                      <td
                        style={{
                          ...styles.td,
                          color:
                            "#127474",
                          fontWeight: 700,
                        }}
                      >
                        {data.total_assignment ||
                          0}
                      </td>

                      <td
                        style={{
                          ...styles.td,
                          color:
                            "#2563eb",
                          fontWeight: 700,
                        }}
                      >
                        {data.percentage ||
                          0}
                        %
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  icon,
  bg,
}: any) => (
  <div
    style={{
      ...styles.statCard,
      background: bg,
    }}
  >
    <div>
      <div style={styles.statTitle}>
        {title}
      </div>

      <div style={styles.statValue}>
        {value}
      </div>
    </div>

    <div style={styles.statIcon}>
      {icon}
    </div>
  </div>
);

const styles: any = {
  page: {
    padding: 24,
    background:
      "linear-gradient(to bottom right,#f8fafc,#eef2ff)",
    minHeight: "100vh",
  },

  header: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 20,
    marginBottom: 28,
  },

  title: {
    margin: 0,
    fontSize: 32,
    fontWeight: 800,
    color: "#172033",
  },

  subtitle: {
    marginTop: 6,
    color: "#667085",
    fontSize: 15,
  },

  saveBtn: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    border: "none",
    borderRadius: 14,
    padding: "14px 24px",
    background:
      "linear-gradient(135deg,#2563eb,#1d4ed8)",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 15,
    boxShadow:
      "0 10px 20px rgba(37,99,235,0.25)",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(250px,1fr))",
    gap: 18,
    marginBottom: 24,
  },

  statCard: {
    borderRadius: 22,
    padding: 24,
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    color: "#fff",
    boxShadow:
      "0 10px 24px rgba(0,0,0,0.12)",
  },

  statTitle: {
    color:
      "rgba(255,255,255,0.88)",
    fontSize: 14,
    marginBottom: 8,
    fontWeight: 500,
  },

  statValue: {
    color: "#fff",
    fontSize: 30,
    fontWeight: 800,
  },

  statIcon: {
    width: 58,
    height: 58,
    borderRadius: 16,
    background:
      "rgba(255,255,255,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
  },

  filterCard: {
    background: "#fff",
    borderRadius: 22,
    padding: 20,
    display: "flex",
    gap: 16,
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 24,
    boxShadow:
      "0 8px 20px rgba(15,23,42,0.06)",
  },

  searchBox: {
    flex: 1,
    minWidth: 260,
    display: "flex",
    alignItems: "center",
    gap: 10,
    border: "1px solid #dce4ec",
    borderRadius: 14,
    padding: "0 14px",
    background: "#f8fafc",
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
    minWidth: 200,
    borderRadius: 14,
    border: "1px solid #dce4ec",
    padding: 14,
    outline: "none",
    background: "#f8fafc",
    fontSize: 14,
  },

  tableCard: {
    background: "#fff",
    borderRadius: 24,
    padding: 20,
    boxShadow:
      "0 8px 24px rgba(15,23,42,0.06)",
  },

  tableWrap: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse:
      "separate",
    borderSpacing: "0 12px",
    minWidth: 850,
  },

  th: {
    textAlign: "left",
    padding: "14px 16px",
    color: "#667085",
    fontSize: 13,
    fontWeight: 700,
  },

  tr: {
    background: "#f8fafc",
    borderRadius: 16,
  },

  td: {
    padding: "16px",
    fontSize: 14,
    color: "#172033",
    background: "#f8fafc",
  },

  nameCell: {
    color: "rgba(13, 14, 14, 0.6)",
    fontWeight: 700,
  },

  input: {
    width: 80,
    padding: 10,
    borderRadius: 10,
    border: "1px solid #dce4ec",
    textAlign: "center",
    outline: "none",
    background: "#fff",
    fontWeight: 600,
  },
};

export default Assignments;