import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { Save } from "lucide-react";
import { Student } from "../types/Student";

type MarksState = Record<number, { ia: number; esa: number }>;

interface Props {
  students: Student[];
  loadMarks?: () => void;
}

const Marks: React.FC<Props> = ({ students, loadMarks }) => {
  const [course, setCourse] = useState("ECE-Semester 8");
  const [subject, setSubject] = useState("Industrial Training");
  const [group, setGroup] = useState("A");
  const [marks, setMarks] = useState<MarksState>({});

  const subjects = [
    "Industrial Training",
    "Program Elective - III",
    "Program Elective - IV",
    "Project Work - II",
    "Industrial Project",
  ];

  const storageKey = `marks-${course}-${subject}-${group}`;

  const filteredStudents = useMemo(() => {
    if (!students || students.length === 0) return [];

    const filtered = students.filter((student) => {
      const dbCourse = (student.course || "")
        .toString()
        .toUpperCase()
        .replace(/\s/g, "")
        .replace(/-/g, "")
        .replace(/\./g, "");

      return dbCourse.includes("ECE");
    });

    const sortedStudents = [...filtered].sort((a, b) =>
      (a.name || "").localeCompare(b.name || "")
    );

    return group === "A" ? sortedStudents.slice(0, 42) : sortedStudents.slice(42, 85);
  }, [students, group]);

  useEffect(() => {
    const savedData = localStorage.getItem(storageKey);
    setMarks(savedData ? JSON.parse(savedData) : {});
  }, [storageKey]);

  const handleChange = (studentId: number, field: "ia" | "esa", value: string) => {
    let num = Number(value);
    if (num > 50) num = 50;
    if (num < 0) num = 0;

    const updatedMarks = {
      ...marks,
      [studentId]: {
        ...marks[studentId],
        [field]: num,
      },
    };

    setMarks(updatedMarks);
    localStorage.setItem(storageKey, JSON.stringify(updatedMarks));
  };

  const getTotal = (id: number) => {
    const ia = marks[id]?.ia || 0;
    const esa = marks[id]?.esa || 0;
    return ia + esa;
  };

  const handleSave = () => {
    localStorage.setItem(storageKey, JSON.stringify(marks));

    Swal.fire({
      icon: "success",
      title: "Marks Saved Successfully",
      text: "Data saved permanently.",
      timer: 2000,
      showConfirmButton: false,
    });

    if (loadMarks) loadMarks();
  };

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">Semester 8 Marks Entry</h1>
          <p className="page-subtitle">
            Enter IA and External marks for ECE Semester 8 students
          </p>
        </div>
      </div>

      <div className="form-card">
        <div className="form-grid" style={{ width: "100%" }}>
          <div>
            <label style={styles.label}>Select Course</label>
            <select
              style={styles.select}
              value={course}
              onChange={(e) => setCourse(e.target.value)}
            >
              <option value="ECE-Semester 8">ECE - Semester 8</option>
            </select>
          </div>

          <div>
            <label style={styles.label}>Select Subject</label>
            <select
              style={styles.select}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              {subjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={styles.label}>Select Group</label>
            <select
              style={styles.select}
              value={group}
              onChange={(e) => setGroup(e.target.value)}
            >
              <option value="A">Group A (1 - 42 Students)</option>
              <option value="B">Group B (43 - 85 Students)</option>
            </select>
          </div>

          <button style={styles.saveBtn} className="add-btn" onClick={handleSave}>
            <Save size={16} />
            Save Marks
          </button>
        </div>
      </div>

      <div className="table-card data-table-wrap">
        <table>
          <thead>
            <tr>
              <th>S.N.</th>
              <th>Roll No.</th>
              <th>Student Name</th>
              <th>IA Marks (50)</th>
              <th>External Marks (50)</th>
              <th>Total (100)</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={6} style={styles.noData}>
                  No Students Found
                </td>
              </tr>
            ) : (
              filteredStudents.map((student, index) => {
                const id = Number(student.id);

                return (
                  <tr key={id}>
                    <td>{group === "A" ? index + 1 : index + 43}</td>
                    <td>{student.rollno}</td>
                    <td style={styles.nameCell}>{student.name}</td>
                    <td>
                      <input
                        type="number"
                        min={0}
                        max={50}
                        value={marks[id]?.ia ?? ""}
                        style={styles.input}
                        onChange={(e) => handleChange(id, "ia", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min={0}
                        max={50}
                        value={marks[id]?.esa ?? ""}
                        style={styles.input}
                        onChange={(e) => handleChange(id, "esa", e.target.value)}
                      />
                    </td>
                    <td style={styles.total}>{getTotal(id)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        <div className="note-box">
          IA = 50 | External = 50 | Total = 100 | Students are sorted alphabetically.
        </div>
      </div>
    </div>
  );
};

const styles: any = {
  label: {
    display: "block",
    marginBottom: 8,
    color: "#334155",
    fontSize: 12,
    fontWeight: 700,
  },
  select: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    border: "1px solid #dce4ec",
    background: "#fff",
    outline: "none",
  },
  saveBtn: {
    minWidth: 150,
    height: 44,
  },
  input: {
    width: 96,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #dce4ec",
    textAlign: "center",
    outline: "none",
  },
  nameCell: {
    color: "#172033",
    fontWeight: 400,
    textAlign: "left",
  },
  total: {
    color: "#0f766e",
    fontSize: 12,
    fontWeight: 700,
  },
  noData: {
    padding: 30,
    color: "#667085",
    textAlign: "center",
  },
};

export default Marks;
