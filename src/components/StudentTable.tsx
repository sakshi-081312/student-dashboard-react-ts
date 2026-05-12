import React, { useState } from "react";
import { Student } from "../types/Student";
import {
  Pencil,
  Trash2,
  UserCircle2,
  Phone,
  Mail,
  GraduationCap,
  MapPin
} from "lucide-react";

interface Props {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: number) => void;
}

// ================= COURSE LABEL MAP =================
const courseLabels: Record<string, string> = {
  ECE: "E.C.E",
  EEE: "E.E.E",
  CIVIL: "Civil",
  MECHANICAL: "Mechanical",
  CSE: "C.S.E"
};

// ================= NORMALIZE FUNCTION =================
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

const StudentTable: React.FC<Props> = ({
  students,
  onEdit,
  onDelete
}) => {

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [sortField, setSortField] = useState<keyof Student>("id");
  const [sortOrder, setSortOrder] =
    useState<"asc" | "desc">("asc");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [rowsPerPage, setRowsPerPage] =
    useState(5);

  const [selectedStudent, setSelectedStudent] =
    useState<Student | null>(null);

  // ================= FILTER =================
  const filteredStudents = students.filter((s) => {

    const matchesCourse =
      courseFilter
        ? normalizeCourse(s.course) ===
          normalizeCourse(courseFilter)
        : true;

    const matchesSearch =
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase()) ||
      String(s.rollno).includes(search);

    return matchesCourse && matchesSearch;
  });

  // ================= SORT =================
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

    if (aVal < bVal)
      return sortOrder === "asc" ? -1 : 1;

    if (aVal > bVal)
      return sortOrder === "asc" ? 1 : -1;

    return 0;
  });

  // ================= PAGINATION =================
  const indexOfLast =
    currentPage * rowsPerPage;

  const indexOfFirst =
    indexOfLast - rowsPerPage;

  const currentStudents =
    sortedStudents.slice(
      indexOfFirst,
      indexOfLast
    );

  const totalPages = Math.ceil(
    sortedStudents.length / rowsPerPage
  );

  // ================= SORT FUNCTION =================
  const handleSort = (field: keyof Student) => {

    if (sortField === field) {

      setSortOrder(
        sortOrder === "asc"
          ? "desc"
          : "asc"
      );

    } else {

      setSortField(field);
      setSortOrder("asc");

    }
  };

  const getSortIcon = (
    field: keyof Student
  ) => {

    if (sortField !== field)
      return "⇅";

    return sortOrder === "asc"
      ? "↑"
      : "↓";
  };

  return (

    <div style={styles.wrapper}>

      {/* ================= FILTER BAR ================= */}

      <div style={styles.filterBar}>

        <select
          value={courseFilter}
          onChange={(e) => {
            setCourseFilter(e.target.value);
            setCurrentPage(1);
          }}
          style={styles.select}
        >

          <option value="">
            All Courses
          </option>

          <option value="ECE">
            E.C.E
          </option>

          <option value="EEE">
            E.E.E
          </option>

          <option value="CIVIL">
            Civil
          </option>

          <option value="MECHANICAL">
            Mechanical
          </option>

          <option value="CSE">
            C.S.E
          </option>

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

      {/* ================= TABLE ================= */}

      <div style={styles.card}>

        <table style={styles.table}>

          <thead style={styles.thead}>

            <tr>

              <th
                style={styles.th}
                onClick={() => handleSort("id")}
              >
                ID {getSortIcon("id")}
              </th>

              <th
                style={styles.th}
                onClick={() => handleSort("name")}
              >
                Student {getSortIcon("name")}
              </th>

              <th
                style={styles.th}
                onClick={() => handleSort("rollno")}
              >
                Roll No {getSortIcon("rollno")}
              </th>

              <th
                style={styles.th}
                onClick={() => handleSort("email")}
              >
                Email {getSortIcon("email")}
              </th>

              <th
                style={styles.th}
                onClick={() => handleSort("course")}
              >
                Course {getSortIcon("course")}
              </th>

              <th style={styles.th}>
                Status
              </th>

              <th style={styles.th}>
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {currentStudents.map((s) => (

              <tr
                key={s.id}
                style={styles.row}
              >

                <td style={styles.td}>
                  {s.id}
                </td>

                {/* PROFILE */}
                <td style={styles.td}>

                  <div style={styles.profileWrap}>

                    <button
                      style={styles.profileIconBtn}
                      onClick={() =>
                        setSelectedStudent(s)
                      }
                    >

                      <UserCircle2
                        size={42}
                      />

                    </button>

                    <div
                      style={styles.profileInfo}
                    >

                      <div
                        style={styles.studentName}
                      >
                        {s.name}
                      </div>

                    </div>

                  </div>

                </td>

                <td style={styles.td}>
                  {s.rollno}
                </td>

                <td style={styles.td}>
                  {s.email}
                </td>

                <td style={styles.td}>

                  {
                    courseLabels[
                      normalizeCourse(
                        s.course
                      )
                    ] || s.course
                  }

                </td>

                {/* STATUS */}
                <td style={styles.td}>

                  <span
                    style={{
                      padding:
                        "5px 12px",
                      borderRadius:
                        "20px",
                      color: "white",
                      fontWeight:
                        "600",
                      fontSize:
                        "11px",
                      background:
                        s.status ===
                        "Inactive"
                          ? "#ef4444"
                          : "#22c55e"
                    }}
                  >

                    {s.status ||
                      "Active"}

                  </span>

                </td>

                {/* ACTIONS */}
                <td style={styles.td}>

                  <div
                    style={styles.actionWrap}
                  >

                    <button
                      onClick={() =>
                        onEdit(s)
                      }
                      style={
                        styles.editBtn
                      }
                    >

                      <Pencil
                        size={16}
                      />

                    </button>

                    <button
                      onClick={() =>
                        onDelete(s.id!)
                      }
                      style={
                        styles.deleteBtn
                      }
                    >

                      <Trash2
                        size={16}
                      />

                    </button>

                  </div>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      {/* ================= PAGINATION ================= */}

      <div style={styles.pagination}>

        <div>

          Rows:

          <select
            value={rowsPerPage}
            onChange={(e) => {

              setRowsPerPage(
                Number(
                  e.target.value
                )
              );

              setCurrentPage(1);

            }}
            style={styles.rowsSelect}
          >

            <option value={5}>
              5
            </option>

            <option value={10}>
              10
            </option>

            <option value={20}>
              20
            </option>

          </select>

        </div>

        <div>

          {indexOfFirst + 1} -{" "}
          {Math.min(
            indexOfLast,
            sortedStudents.length
          )}
          {" "}of{" "}
          {sortedStudents.length}

        </div>

        <div
          style={styles.paginationButtons}
        >

          <button
            style={styles.pageBtn}
            onClick={() =>
              setCurrentPage(1)
            }
          >
            ⏮
          </button>

          <button
            style={styles.pageBtn}
            onClick={() =>
              setCurrentPage((p) =>
                Math.max(p - 1, 1)
              )
            }
          >
            ◀
          </button>

          <span
            style={styles.pageNumber}
          >
            {currentPage}
          </span>

          <button
            style={styles.pageBtn}
            onClick={() =>
              setCurrentPage((p) =>
                Math.min(
                  p + 1,
                  totalPages
                )
              )
            }
          >
            ▶
          </button>

          <button
            style={styles.pageBtn}
            onClick={() =>
              setCurrentPage(
                totalPages
              )
            }
          >
            ⏭
          </button>

        </div>

      </div>

      {/* ================= PROFILE MODAL ================= */}

      {selectedStudent && (

        <div style={styles.modalOverlay}>

          <div style={styles.modal}>

            <button
              style={styles.closeBtn}
              onClick={() =>
                setSelectedStudent(null)
              }
            >
              ✕
            </button>

            {/* TOP */}
            <div
              style={styles.modalTop}
            >

              <div
                style={styles.bigProfile}
              >

                <UserCircle2
                  size={70}
                />

              </div>

              <div>

                <h2
                  style={
                    styles.modalName
                  }
                >
                  {
                    selectedStudent.name
                  }
                </h2>

                <p
                  style={
                    styles.modalCourse
                  }
                >
                  {
                    selectedStudent.course
                  }
                </p>

              </div>

            </div>

            {/* DETAILS */}
            <div
              style={styles.detailsGrid}
            >

              <div
                style={styles.detailCard}
              >
                <GraduationCap
                  size={18}
                />

                <div>
                  <span
                    style={
                      styles.label
                    }
                  >
                    Roll No
                  </span>

                  <p
                    style={
                      styles.value
                    }
                  >
                    {
                      selectedStudent.rollno ||
                      "-"
                    }
                  </p>
                </div>
              </div>

              <div
                style={styles.detailCard}
              >
                <Mail size={18} />

                <div>
                  <span
                    style={
                      styles.label
                    }
                  >
                    Email
                  </span>

                  <p
                    style={
                      styles.value
                    }
                  >
                    {
                      selectedStudent.email ||
                      "-"
                    }
                  </p>
                </div>
              </div>

              <div
                style={styles.detailCard}
              >
                <UserCircle2
                  size={18}
                />

                <div>
                  <span
                    style={
                      styles.label
                    }
                  >
                    Father's Name
                  </span>

                  <p
                    style={
                      styles.value
                    }
                  >
                    {
                      (selectedStudent as any)
                        .fatherName ||
                      "-"
                    }
                  </p>
                </div>
              </div>

              <div
                style={styles.detailCard}
              >
                <UserCircle2
                  size={18}
                />

                <div>
                  <span
                    style={
                      styles.label
                    }
                  >
                    Mother's Name
                  </span>

                  <p
                    style={
                      styles.value
                    }
                  >
                    {
                      (selectedStudent as any)
                        .motherName ||
                      "-"
                    }
                  </p>
                </div>
              </div>

              <div
                style={styles.detailCard}
              >
                <Phone
                  size={18}
                />

                <div>
                  <span
                    style={
                      styles.label
                    }
                  >
                    Parent Phone
                  </span>

                  <p
                    style={
                      styles.value
                    }
                  >
                    {
                      (selectedStudent as any)
                        .parentPhone ||
                      "-"
                    }
                  </p>
                </div>
              </div>

              <div
                style={styles.detailCard}
              >
                <MapPin
                  size={18}
                />

                <div>
                  <span
                    style={
                      styles.label
                    }
                  >
                    Address
                  </span>

                  <p
                    style={
                      styles.value
                    }
                  >
                    {
                      (selectedStudent as any)
                        .address ||
                      "-"
                    }
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default StudentTable;

// ================= STYLES =================

const styles: any = {

  wrapper: {
    padding: "20px"
  },

  filterBar: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px"
  },

  select: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #d1d5db"
  },

  search: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #d1d5db"
  },

  card: {
    background: "#fff",
    padding: "15px",
    borderRadius: "16px",
    boxShadow:
      "0 4px 16px rgba(0,0,0,0.06)"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  },

  thead: {
    background: "#0f172a",
    color: "#fff"
  },

  th: {
    padding: "14px",
    cursor: "pointer",
    textAlign: "center",
    fontSize: "14px"
  },

  td: {
    padding: "14px",
    textAlign: "center",
    verticalAlign: "middle",
    fontSize: "14px"
  },

  row: {
    borderBottom:
      "1px solid #f1f5f9"
  },

  profileWrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },

  profileIconBtn: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: "#334155",
    padding: 0
  },

  profileInfo: {
    display: "flex",
    flexDirection: "column"
  },

  studentName: {
    fontWeight: "600",
    fontSize: "14px",
    textAlign: "left"
  },

  actionWrap: {
    display: "flex",
    justifyContent: "center",
    gap: "8px"
  },

  editBtn: {
    border: "none",
    background: "#dbeafe",
    color: "#2563eb",
    width: "34px",
    height: "34px",
    borderRadius: "10px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  deleteBtn: {
    border: "none",
    background: "#fee2e2",
    color: "#dc2626",
    width: "34px",
    height: "34px",
    borderRadius: "10px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  pagination: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "20px"
  },

  paginationButtons: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },

  pageBtn: {
    background: "#0f172a",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer"
  },

  pageNumber: {
    fontWeight: "bold"
  },

  rowsSelect: {
    marginLeft: "8px",
    padding: "5px",
    borderRadius: "5px"
  },

  // ================= MODAL =================

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background:
      "rgba(15,23,42,0.55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    backdropFilter: "blur(4px)"
  },

  modal: {
    width: "520px",
    maxWidth: "92%",
    background: "#fff",
    borderRadius: "24px",
    padding: "24px",
    position: "relative",
    boxShadow:
      "0 20px 50px rgba(0,0,0,0.18)"
  },

  closeBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    border: "none",
    background: "#f1f5f9",
    color: "#0f172a",
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold"
  },

  modalTop: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px"
  },

  bigProfile: {
    color: "#334155"
  },

  modalName: {
    margin: 0,
    fontSize: "24px",
    color: "#0f172a"
  },

  modalCourse: {
    marginTop: "4px",
    color: "#64748b",
    fontSize: "14px"
  },

  detailsGrid: {
    display: "grid",
    gridTemplateColumns:
      "1fr 1fr",
    gap: "14px"
  },

  detailCard: {
    background: "#f8fafc",
    borderRadius: "16px",
    padding: "14px",
    display: "flex",
    gap: "12px",
    alignItems: "flex-start"
  },

  label: {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "600"
  },

  value: {
    margin: "4px 0 0",
    fontSize: "14px",
    color: "#0f172a",
    fontWeight: "600"
  }

};