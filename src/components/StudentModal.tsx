import React, { useState, useEffect } from "react";
import { Student } from "../types/Student";
import { X } from "lucide-react";

interface Props {
  show: boolean;
  onClose: () => void;
  onSave: (student: Student) => void;
  editStudent?: Student | null;
}

const StudentModal: React.FC<Props> = ({
  show,
  onClose,
  onSave,
  editStudent
}) => {

  // ✅ DEFAULT FORM STATE (WITH STATUS)
  const [student, setStudent] = useState<Student>({
    rollno: "" as any,
    name: "",
    email: "",
    course: "",
    status: "Active"
  });

  // ✅ EDIT / RESET LOGIC
  useEffect(() => {
    if (editStudent) {
      setStudent({
        ...editStudent,
        status: editStudent.status || "Active"
      });
    } else {
      setStudent({
        rollno: "" as any,
        name: "",
        email: "",
        course: "",
        status: "Active"
      });
    }
  }, [editStudent, show]);

  if (!show) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>

        {/* CLOSE ICON */}
        <X
          size={20}
          onClick={onClose}
          style={styles.closeIcon}
        />

        {/* TITLE */}
        <h3 style={styles.title}>
          {editStudent ? "Edit Student" : "Add Student"}
        </h3>

        {/* ROLL NO */}
        <input
          style={styles.input}
          placeholder="Roll No"
          value={student.rollno}
          onChange={(e) =>
            setStudent({ ...student, rollno: Number(e.target.value) })
          }
        />

        {/* NAME */}
        <input
          style={styles.input}
          placeholder="Name"
          value={student.name}
          onChange={(e) =>
            setStudent({ ...student, name: e.target.value })
          }
        />

        {/* EMAIL */}
        <input
          style={styles.input}
          placeholder="Email"
          value={student.email}
          onChange={(e) =>
            setStudent({ ...student, email: e.target.value })
          }
        />

        {/* COURSE */}
        <input
          style={styles.input}
          placeholder="Course"
          value={student.course}
          onChange={(e) =>
            setStudent({ ...student, course: e.target.value })
          }
        />

        {/* ✅ STATUS DROPDOWN */}
        <select
          style={styles.input}
          value={student.status}
          onChange={(e) =>
            setStudent({
              ...student,
              status: e.target.value as "Active" | "Inactive"
            })
          }
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        {/* SAVE BUTTON */}
        <button
          style={styles.saveBtn}
          onClick={() => onSave(student)}
        >
          Save
        </button>

      </div>
    </div>
  );
};

export default StudentModal;

// ================= STYLES =================
const styles: any = {

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  modal: {
    background: "#fff",
    width: "360px",
    borderRadius: "12px",
    padding: "20px",
    position: "relative",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
  },

  closeIcon: {
    position: "absolute",
    top: "10px",
    right: "10px",
    cursor: "pointer",
    color: "#444"
  },

  title: {
    marginTop: "10px",
    marginBottom: "15px",
    fontSize: "18px",
    fontWeight: "bold"
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    outline: "none"
  },

  saveBtn: {
    width: "100%",
    padding: "10px",
    background: "#172b4d",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold"
  }
};