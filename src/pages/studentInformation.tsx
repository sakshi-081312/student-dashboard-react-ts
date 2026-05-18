import React, { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { Plus, Save } from "lucide-react";

interface Props {
  students: any[];
  attendance: any[];
  assignments: any[];
  marks: any[];
}

const StudentInformation: React.FC<Props> = ({
  students,
  attendance,
  assignments,
  marks,
}) => {

  const sidebarColor = "#111827";
  const sidebarLight = "#1f2937";
  const accentColor = "#14b8a6";

  const [search, setSearch] = useState("");
  const [localStudents, setLocalStudents] = useState(students || []);
  const [showModal, setShowModal] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const [newStudent, setNewStudent] = useState({
    name: "",
    mst1: "",
    mst2: "",
  });

  const [sortConfig, setSortConfig] = useState({
    key: "latest",
    direction: "desc",
  });

  // ================= MARKS =================

  const getMarks = (id: number) =>
    marks.find((m) => m.student_id === id);

  const getTotalMarks = (id: number) => {
    const m = getMarks(id);

    return (Number(m?.mst1) || 0) +
      (Number(m?.mst2) || 0);
  };

  // ================= SORT =================

  const handleSort = (key: string) => {

    let direction = "asc";

    if (
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }

    setSortConfig({
      key,
      direction,
    });
  };

  // ================= FILTER + SORT =================

  const sortedStudents = useMemo(() => {

    let filtered = [...localStudents].filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase())
    );

    filtered.sort((a, b) => {

      let aValue: any;
      let bValue: any;

      if (sortConfig.key === "latest") {

        return sortConfig.direction === "asc"
          ? a.id - b.id
          : b.id - a.id;
      }

      if (sortConfig.key === "name") {

        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      }

      if (sortConfig.key === "marks") {

        aValue = getTotalMarks(a.id);
        bValue = getTotalMarks(b.id);
      }

      if (aValue < bValue)
        return sortConfig.direction === "asc"
          ? -1
          : 1;

      if (aValue > bValue)
        return sortConfig.direction === "asc"
          ? 1
          : -1;

      return 0;

    });

    return filtered;

  }, [localStudents, search, sortConfig]);

  // ================= ADD STUDENT =================

  const handleAddStudent = () => {

    if (!newStudent.name) {

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter student name",
        confirmButtonColor: accentColor,
      });

      return;
    }

    const newEntry = {
      id: Date.now(),
      name: newStudent.name,
    };

    setLocalStudents([newEntry, ...localStudents]);

    marks.push({
      student_id: newEntry.id,
      mst1: Number(newStudent.mst1),
      mst2: Number(newStudent.mst2),
    });

    Swal.fire({
      icon: "success",
      title: "Success 🎉",
      text: "Student added successfully!",
      confirmButtonColor: accentColor,
    });

    setShowModal(false);

    setNewStudent({
      name: "",
      mst1: "",
      mst2: "",
    });
  };

  // ================= UI =================

  return (

    <div style={styles.page}>

      {/* HEADER */}

      <div style={styles.header}>

        <div>

          <h2 style={styles.heading}>
            🎓 Student Information
          </h2>

          <p style={styles.subHeading}>
            Manage students, marks and profiles
          </p>

        </div>

        <button
          style={{
            ...styles.addBtn,
            background: accentColor,
          }}
          onClick={() => setShowModal(true)}
        >
          <Plus size={16} />
          Add Student
        </button>

      </div>

      {/* SEARCH */}

      <div style={styles.searchBox}>

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

      {/* TABLE */}

      <div style={styles.tableCard}>

        <table style={styles.table}>

          <thead>

            <tr>

              <th
                style={{
                  ...styles.th,
                  background: sidebarColor,
                }}
                onClick={() => handleSort("name")}
              >
                Student Name {" "}
                {sortConfig.key === "name"
                  ? sortConfig.direction === "asc"
                    ? "↑"
                    : "↓"
                  : "↕"}
              </th>

              <th
                style={{
                  ...styles.th,
                  background: sidebarColor,
                }}
              >
                MST 1
              </th>

              <th
                style={{
                  ...styles.th,
                  background: sidebarColor,
                }}
              >
                MST 2
              </th>

              <th
                style={{
                  ...styles.th,
                  background: sidebarColor,
                }}
                onClick={() => handleSort("marks")}
              >
                Total {" "}
                {sortConfig.key === "marks"
                  ? sortConfig.direction === "asc"
                    ? "↑"
                    : "↓"
                  : "↕"}
              </th>

            </tr>

          </thead>

          <tbody>

            {sortedStudents.map((student, index) => {

              const m = getMarks(student.id);

              const total =
                (Number(m?.mst1) || 0) +
                (Number(m?.mst2) || 0);

              return (

                <tr
                  key={student.id}
                  style={{
                    background:
                      index % 2 === 0
                        ? "#ffffff"
                        : "#f8fafc",
                    transition: "0.3s",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    setSelectedStudent({
                      ...student,
                      mst1: m?.mst1 || 0,
                      mst2: m?.mst2 || 0,
                      total,
                    })
                  }
                >

                  <td style={styles.td}>

                    <div style={styles.studentInfo}>

                      <div
                        style={{
                          ...styles.avatar,
                          background: accentColor,
                        }}
                      >
                        {student.name
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </div>

                      <div>

                        <div
                          style={{
                            fontWeight: 400,
                          }}
                        >
                          {student.name}
                        </div>

                        <div
                          style={{
                            fontSize: "12px",
                            color: "#64748b",
                          }}
                        >
                          ID: {student.id}
                        </div>

                      </div>

                    </div>

                  </td>

                  <td style={styles.td}>
                    {m?.mst1 || 0}
                  </td>

                  <td style={styles.td}>
                    {m?.mst2 || 0}
                  </td>

                  <td style={styles.td}>

                    <span
                      style={{
                        ...styles.badge,
                        background: "#dcfce7",
                        color: "#166534",
                      }}
                    >
                      {total}
                    </span>

                  </td>

                </tr>

              );
            })}

          </tbody>

        </table>

      </div>

      {/* PROFILE MODAL */}

      {selectedStudent && (

        <div style={styles.overlay}>

          <div style={styles.profileModal}>

            <div
              style={{
                textAlign: "center",
              }}
            >

              <div
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  background: accentColor,
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: "bold",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 auto 15px",
                }}
              >
                {selectedStudent.name
                  ?.charAt(0)
                  ?.toUpperCase()}
              </div>

              <h2 style={{ fontSize: "14px" }}>{selectedStudent.name}</h2>

              <p
                style={{
                  color: "#64748b",
                  marginBottom: "20px",
                }}
              >
                Student Profile
              </p>

            </div>

            <div style={styles.profileBox}>
              <span>MST 1</span>
              <strong>{selectedStudent.mst1}</strong>
            </div>

            <div style={styles.profileBox}>
              <span>MST 2</span>
              <strong>{selectedStudent.mst2}</strong>
            </div>

            <div style={styles.profileBox}>
              <span>Total Marks</span>
              <strong>{selectedStudent.total}</strong>
            </div>

            <button
              style={{
                ...styles.closeBtn,
                background: sidebarColor,
              }}
              onClick={() =>
                setSelectedStudent(null)
              }
            >
              Close
            </button>

          </div>

        </div>

      )}

      {/* ADD STUDENT MODAL */}

      {showModal && (

        <div style={styles.overlay}>

          <div style={styles.modal}>

            <h3 style={styles.modalTitle}>
              Add Student
            </h3>

            <input
              type="text"
              placeholder="Student Name"
              value={newStudent.name}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  name: e.target.value,
                })
              }
              style={styles.input}
            />

            <input
              type="number"
              placeholder="MST 1"
              value={newStudent.mst1}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  mst1: e.target.value,
                })
              }
              style={styles.input}
            />

            <input
              type="number"
              placeholder="MST 2"
              value={newStudent.mst2}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  mst2: e.target.value,
                })
              }
              style={styles.input}
            />

            <div style={styles.buttonGroup}>

              <button
                style={{
                  ...styles.saveBtn,
                  background: accentColor,
                }}
                onClick={handleAddStudent}
              >
                <Save size={16} />
                Save
              </button>

              <button
                style={styles.cancelBtn}
                onClick={() =>
                  setShowModal(false)
                }
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

// ================= STYLES =================

const styles: any = {

  page: {
    marginLeft: "220px",
    padding: "25px",
    background: "#f1f5f9",
    minHeight: "100vh",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },

  heading: {
    margin: 0,
    fontSize: "14px",
    fontWeight: 700,
    color: "#0f172a",
  },

  subHeading: {
    marginTop: "5px",
    color: "#64748b",
  },

  addBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    border: "none",
    color: "#fff",
    padding: "12px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "12px",
  },

  searchBox: {
    marginBottom: "20px",
  },

  searchInput: {
    width: "350px",
    padding: "12px 15px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    outline: "none",
    fontSize: "12px",
    background: "#fff",
  },

  tableCard: {
    background: "#fff",
    borderRadius: "18px",
    overflow: "hidden",
    boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    color: "#fff",
    padding: "18px",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: 600,
  },

  td: {
    padding: "18px",
    borderBottom: "1px solid #e2e8f0",
    fontSize: "12px",
  },

  studentInfo: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  avatar: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "14px",
  },

  badge: {
    padding: "6px 14px",
    borderRadius: "30px",
    fontWeight: 600,
    fontSize: "12px",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    backdropFilter: "blur(4px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  modal: {
    width: "380px",
    background: "#fff",
    borderRadius: "18px",
    padding: "25px",
  },

  profileModal: {
    width: "400px",
    background: "#fff",
    borderRadius: "20px",
    padding: "30px",
  },

  modalTitle: {
    textAlign: "center",
    marginBottom: "20px",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    outline: "none",
    fontSize: "12px",
    boxSizing: "border-box",
  },

  buttonGroup: {
    display: "flex",
    gap: "10px",
  },

  saveBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    flex: 1,
    border: "none",
    color: "#fff",
    padding: "12px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 600,
  },

  cancelBtn: {
    flex: 1,
    border: "none",
    background: "#e2e8f0",
    padding: "12px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 600,
  },

  closeBtn: {
    width: "100%",
    color: "#fff",
    border: "none",
    padding: "12px",
    borderRadius: "10px",
    cursor: "pointer",
    marginTop: "20px",
    fontWeight: 600,
  },

  profileBox: {
    background: "#f8fafc",
    padding: "14px",
    borderRadius: "12px",
    marginBottom: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

};

export default StudentInformation;
