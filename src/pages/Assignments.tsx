import React, { useMemo, useState } from "react";
import Swal from "sweetalert2";

import { addAssignment } from "../services/api";

interface Props {
  students: any[];
  loadAssignments: () => void;
}

const Assignments: React.FC<Props> = ({ students, loadAssignments }) => {
  const [marksData, setMarksData] = useState<any>({});
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");

  const filteredStudents = useMemo(() => {
    return (students || [])
      .filter((student) => {
        const query = search.toLowerCase();
        const matchSearch =
          student.name?.toLowerCase().includes(query) ||
          String(student.rollno || "").toLowerCase().includes(query);
        const matchCourse = courseFilter ? student.course === courseFilter : true;

        return matchSearch && matchCourse;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [students, search, courseFilter]);

  const handleChange = (id: number, field: string, value: number) => {
    if (value < 0 || value > 100) return;

    setMarksData((prev: any) => {
      const updated = { ...(prev[id] || {}), [field]: value };
      const total = Number(updated.assignment1 || 0) + Number(updated.assignment2 || 0);

      updated.total_assignment = total;
      updated.percentage = ((total / 200) * 100).toFixed(2);

      return { ...prev, [id]: updated };
    });
  };

  const handleSave = async () => {
    try {
      const payload = filteredStudents
        .map((student) => {
          const data = marksData[student.id];
          if (!data) return null;

          return {
            student_id: student.id,
            student_name: student.name,
            assignment1: data.assignment1 || 0,
            assignment2: data.assignment2 || 0,
            total_assignment: data.total_assignment || 0,
            percentage: Number(data.percentage) || 0,
            submission_date: new Date(),
          };
        })
        .filter(Boolean);

      if (payload.length === 0) {
        Swal.fire("Warning", "No data to save", "warning");
        return;
      }

      await addAssignment(payload as any[]);
      Swal.fire("Saved!", "Assignments saved successfully", "success");
      setMarksData({});
      loadAssignments();
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Failed to save", "error");
    }
  };

  const completedEntries = Object.keys(marksData).length;

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">Assignment Management</h1>
          <p className="page-subtitle">Manage assignment marks for all students</p>
        </div>

        <button
          onClick={handleSave}
          disabled={completedEntries === 0}
          className="add-btn"
        >
          Save Assignments
        </button>
      </div>

      <div className="responsive-stats">
        <StatCard title="Total Students" value={String(filteredStudents.length)} />
        <StatCard title="Completed Entries" value={String(completedEntries)} green />
        <StatCard title="Maximum Marks" value="200" blue />
      </div>

      <div className="form-card">
        <input
          type="text"
          placeholder="Search by name or roll no..."
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
          <option value="C.S.E">C.S.E</option>
          <option value="E.E.E">E.E.E</option>
          <option value="MECHANICAL">MECHANICAL</option>
          <option value="CIVIL">CIVIL</option>
        </select>
      </div>

      <div className="table-card data-table-wrap">
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Roll No</th>
              <th>Student Name</th>
              <th>Assignment 1</th>
              <th>Assignment 2</th>
              <th>Total</th>
              <th>Percentage</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((student, index) => {
              const data = marksData[student.id] || {};

              return (
                <tr key={student.id}>
                  <td>{index + 1}</td>
                  <td>{student.rollno}</td>
                  <td style={styles.nameCell}>{student.name}</td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={data.assignment1 || ""}
                      onChange={(e) =>
                        handleChange(
                          student.id,
                          "assignment1",
                          e.target.value === "" ? 0 : Number(e.target.value)
                        )
                      }
                      style={styles.input}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={data.assignment2 || ""}
                      onChange={(e) =>
                        handleChange(
                          student.id,
                          "assignment2",
                          e.target.value === "" ? 0 : Number(e.target.value)
                        )
                      }
                      style={styles.input}
                    />
                  </td>
                  <td style={styles.total}>{data.total_assignment || 0}</td>
                  <td style={styles.percent}>{data.percentage || 0}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, green, blue }: any) => {
  let bg = "#fff";
  if (green) bg = "#ecfdf5";
  if (blue) bg = "#eff6ff";

  return (
    <div style={{ ...styles.statCard, background: bg }}>
      <div style={styles.statTitle}>{title}</div>
      <div style={styles.statValue}>{value}</div>
    </div>
  );
};

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
  input: {
    width: 70,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #dce4ec",
    textAlign: "center",
    outline: "none",
  },
  nameCell: {
    color: "#172033",
    fontWeight: 700,
    textAlign: "left",
  },
  total: {
    color: "#0f766e",
    fontWeight: 700,
  },
  percent: {
    color: "#2563eb",
    fontWeight: 700,
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

export default Assignments;
