import React, { useState } from "react";

import StudentTable from "../components/StudentTable";
import StudentModal from "../components/StudentModal";

import {
  addStudent,
  updateStudent,
  deleteStudent
} from "../services/api";

import { Student } from "../types/Student";

import Swal from "sweetalert2";

interface Props {
  students: Student[];
  loadStudents: () => Promise<void>;
}

const Students: React.FC<Props> = ({
  students,
  loadStudents
}) => {

  const [showModal, setShowModal] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);

  // ================= UPDATED THEME COLORS =================
  const PRIMARY = "hsl(174, 62%, 55%)";   
  const SECONDARY = "hsl(222, 60%, 18%)";

  // ================= SAVE =================
  const handleSave = async (student: Student) => {
    try {

      if (editStudent) {
        await updateStudent(editStudent.id!, student);
        Swal.fire("Updated!", "Student updated successfully", "success");
      } else {
        await addStudent(student);
        Swal.fire("Added!", "Student added successfully", "success");
      }

      setShowModal(false);
      setEditStudent(null);

      await loadStudents();

    } catch (error) {
      console.log(error);
      Swal.fire("Error!", "Something went wrong", "error");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id: number) => {

    const confirm = await Swal.fire({
      title: "Delete Student?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: PRIMARY,
      cancelButtonColor: SECONDARY
    });

    if (confirm.isConfirmed) {
      await deleteStudent(id);
      Swal.fire("Deleted!", "Student removed", "success");
      await loadStudents();
    }
  };

  // ================= EDIT =================
  const handleEdit = (student: Student) => {
    setEditStudent(student);
    setShowModal(true);
  };

  // ================= UI =================
  return (

    <div
      style={{
        padding: "20px",
        background: "hsla(174,62%,55%,0.06)", 
        minHeight: "100vh",
        fontFamily: "Arial"
      }}
    >

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          padding: "10px 0"
        }}
      >

        <h2
          style={{
            color: SECONDARY,
            fontSize: "24px",
            fontWeight: "bold"
          }}
        >
          🎓 Students Management
        </h2>

        <button
          onClick={() => {
            setEditStudent(null);
            setShowModal(true);
          }}
          style={{
            background: PRIMARY, 
            color: "white",
            padding: "10px 18px",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}
        >
          + Add Student
        </button>

      </div>

      {/* TABLE CARD */}
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          borderTop: `4px solid ${PRIMARY}` // ✅ updated
        }}
      >

        <StudentTable
          students={students}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

      </div>

      {/* MODAL */}
      <StudentModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setEditStudent(null);
        }}
        onSave={handleSave}
        editStudent={editStudent}
      />

    </div>
  );
};

export default Students;