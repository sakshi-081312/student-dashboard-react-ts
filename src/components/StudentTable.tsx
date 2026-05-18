import React, { useState } from "react";
import { Student } from "../types/Student";
import {
  Pencil,
  Trash2,
  UserCircle2,
  Phone,
  Mail,
  GraduationCap,
  MapPin,
} from "lucide-react";

interface Props {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: number) => void;
}

const courseLabels: Record<string, string> = {
  ECE: "E.C.E",
  EEE: "E.E.E",
  CIVIL: "Civil",
  MECHANICAL: "Mechanical",
  CSE: "C.S.E",
};

const normalizeCourse = (course: string) => {
  return (course || "")
    .toUpperCase()
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace("BTECH", "")
    .replace("(ECE)", "ECE")
    .replace("(EEE)", "EEE")
    .replace("(CSE)", "CSE")
    .replace("(CIVIL)", "CIVIL")
    .replace("(MECHANICAL)", "MECHANICAL");
};

const StudentTable: React.FC<Props> = ({ students, onEdit, onDelete }) => {
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [sortField, setSortField] = useState<keyof Student>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filteredStudents = students.filter((student) => {
    const matchesCourse = courseFilter
      ? normalizeCourse(student.course) === normalizeCourse(courseFilter)
      : true;

    const query = search.toLowerCase();
    const matchesSearch =
      student.name?.toLowerCase().includes(query) ||
      student.email?.toLowerCase().includes(query) ||
      String(student.rollno).includes(search);

    return matchesCourse && matchesSearch;
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let aVal: any = a[sortField];
    let bVal: any = b[sortField];

    if (sortField === "rollno" || sortField === "id") {
      aVal = Number(aVal);
      bVal = Number(bVal);
    } else {
      aVal = String(aVal).toLowerCase();
      bVal = String(bVal).toLowerCase();
    }

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.max(Math.ceil(sortedStudents.length / rowsPerPage), 1);
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentStudents = sortedStudents.slice(indexOfFirst, indexOfLast);

  const handleSort = (field: keyof Student) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      return;
    }

    setSortField(field);
    setSortOrder("asc");
  };

  const getSortIcon = (field: keyof Student) => {
    if (sortField !== field) return "Sort";
    return sortOrder === "asc" ? "Up" : "Down";
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.filterBar}>
        <select
          value={courseFilter}
          onChange={(e) => {
            setCourseFilter(e.target.value);
            setCurrentPage(1);
          }}
          style={styles.select}
        >
          <option value="">All Courses</option>
          <option value="ECE">E.C.E</option>
          <option value="EEE">E.E.E</option>
          <option value="CIVIL">Civil</option>
          <option value="MECHANICAL">Mechanical</option>
          <option value="CSE">C.S.E</option>
        </select>

        <input
          placeholder="Search students..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          style={styles.search}
        />
      </div>

      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th} onClick={() => handleSort("id")}>
                ID {getSortIcon("id")}
              </th>
              <th style={styles.th} onClick={() => handleSort("name")}>
                Student {getSortIcon("name")}
              </th>
              <th style={styles.th} onClick={() => handleSort("rollno")}>
                Roll No {getSortIcon("rollno")}
              </th>
              <th style={styles.th} onClick={() => handleSort("email")}>
                Email {getSortIcon("email")}
              </th>
              <th style={styles.th} onClick={() => handleSort("course")}>
                Course {getSortIcon("course")}
              </th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentStudents.map((student) => (
              <tr key={student.id}>
                <td style={styles.td}>{student.id}</td>
                <td style={styles.td}>
                  <div style={styles.profileWrap}>
                    <button
                      type="button"
                      style={styles.profileIconBtn}
                      onClick={() => setSelectedStudent(student)}
                    >
                      <UserCircle2 size={40} />
                    </button>
                    <div style={styles.studentName}>{student.name}</div>
                  </div>
                </td>
                <td style={styles.td}>{student.rollno}</td>
                <td style={styles.td}>{student.email}</td>
                <td style={styles.td}>
                  {courseLabels[normalizeCourse(student.course)] || student.course}
                </td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      background: student.status === "Inactive" ? "#dc2626" : "#0f766e",
                    }}
                  >
                    {student.status || "Active"}
                  </span>
                </td>
                <td style={styles.td}>
                  <div style={styles.actionWrap}>
                    <button
                      type="button"
                      aria-label="Edit student"
                      onClick={() => onEdit(student)}
                      style={styles.editBtn}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      aria-label="Delete student"
                      onClick={() => onDelete(student.id!)}
                      style={styles.deleteBtn}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {currentStudents.length === 0 && (
              <tr>
                <td colSpan={7} style={styles.emptyCell}>
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={styles.pagination}>
        <div>
          Rows:
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            style={styles.rowsSelect}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>

        <div>
          {sortedStudents.length === 0 ? 0 : indexOfFirst + 1} -{" "}
          {Math.min(indexOfLast, sortedStudents.length)} of {sortedStudents.length}
        </div>

        <div style={styles.paginationButtons}>
          <button type="button" style={styles.pageBtn} onClick={() => setCurrentPage(1)}>
            First
          </button>
          <button
            type="button"
            style={styles.pageBtn}
            onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
          >
            Prev
          </button>
          <span style={styles.pageNumber}>{currentPage}</span>
          <button
            type="button"
            style={styles.pageBtn}
            onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
          >
            Next
          </button>
          <button type="button" style={styles.pageBtn} onClick={() => setCurrentPage(totalPages)}>
            Last
          </button>
        </div>
      </div>

      {selectedStudent && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <button
              type="button"
              style={styles.closeBtn}
              onClick={() => setSelectedStudent(null)}
            >
              X
            </button>

            <div style={styles.modalTop}>
              <div style={styles.bigProfile}>
                <UserCircle2 size={70} />
              </div>
              <div>
                <h2 style={styles.modalName}>{selectedStudent.name}</h2>
                <p style={styles.modalCourse}>{selectedStudent.course}</p>
              </div>
            </div>

            <div style={styles.detailsGrid}>
              <Detail icon={<GraduationCap size={18} />} label="Roll No" value={selectedStudent.rollno || "-"} />
              <Detail icon={<Mail size={18} />} label="Email" value={selectedStudent.email || "-"} />
              <Detail icon={<UserCircle2 size={18} />} label="Father's Name" value={(selectedStudent as any).fatherName || "-"} />
              <Detail icon={<UserCircle2 size={18} />} label="Mother's Name" value={(selectedStudent as any).motherName || "-"} />
              <Detail icon={<Phone size={18} />} label="Parent Phone" value={(selectedStudent as any).parentPhone || "-"} />
              <Detail icon={<MapPin size={18} />} label="Address" value={(selectedStudent as any).address || "-"} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Detail = ({ icon, label, value }: any) => (
  <div style={styles.detailCard}>
    {icon}
    <div>
      <span style={styles.label}>{label}</span>
      <p style={styles.value}>{value}</p>
    </div>
  </div>
);

const styles: any = {
  wrapper: {
    padding: 0,
  },
  filterBar: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "15px",
  },
  select: {
    flex: "0 1 180px",
    minWidth: "160px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #dce4ec",
  },
  search: {
    flex: "1 1 240px",
    minWidth: "180px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #dce4ec",
  },
  card: {
    border: "1px solid #dce4ec",
    borderRadius: "8px",
    background: "#fff",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    minWidth: "900px",
    borderCollapse: "collapse",
  },
  th: {
    padding: "13px",
    cursor: "pointer",
    textAlign: "center",
    fontSize: "12px",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "13px",
    textAlign: "center",
    verticalAlign: "middle",
    fontSize: "12px",
  },
  profileWrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  profileIconBtn: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: "#334155",
    padding: 0,
  },
  studentName: {
    fontWeight: 400,
    textAlign: "left",
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: "24px",
    borderRadius: "999px",
    color: "#fff",
    fontWeight: 700,
    fontSize: "12px",
    padding: "4px 10px",
  },
  actionWrap: {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
  },
  editBtn: {
    border: "none",
    background: "#dbeafe",
    color: "#2563eb",
    width: "34px",
    height: "34px",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtn: {
    border: "none",
    background: "#fee2e2",
    color: "#dc2626",
    width: "34px",
    height: "34px",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyCell: {
    padding: "28px",
    color: "#667085",
  },
  pagination: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginTop: "18px",
    color: "#667085",
  },
  paginationButtons: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "8px",
  },
  pageBtn: {
    background: "#1f2a44",
    color: "#fff",
    border: "none",
    padding: "8px 10px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  pageNumber: {
    color: "#172033",
    fontWeight: 700,
  },
  rowsSelect: {
    marginLeft: "8px",
    padding: "6px",
    borderRadius: "8px",
    border: "1px solid #dce4ec",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,0.55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    padding: "16px",
  },
  modal: {
    width: "520px",
    maxWidth: "100%",
    maxHeight: "90vh",
    overflowY: "auto",
    background: "#fff",
    borderRadius: "8px",
    padding: "24px",
    position: "relative",
    boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    border: "none",
    background: "#eef4f8",
    color: "#172033",
    width: "34px",
    height: "34px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 700,
  },
  modalTop: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "22px",
    paddingRight: "42px",
  },
  bigProfile: {
    color: "#334155",
  },
  modalName: {
    margin: 0,
    fontSize: "14px",
    color: "#172033",
  },
  modalCourse: {
    margin: "4px 0 0",
    color: "#667085",
    fontSize: "12px",
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "12px",
  },
  detailCard: {
    background: "#f6f8fb",
    border: "1px solid #dce4ec",
    borderRadius: "8px",
    padding: "14px",
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
  },
  label: {
    fontSize: "12px",
    color: "#667085",
    fontWeight: 700,
  },
  value: {
    margin: "4px 0 0",
    fontSize: "12px",
    color: "#172033",
    fontWeight: 400,
    overflowWrap: "anywhere",
  },
};

export default StudentTable;
