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

  const PRIMARY = "#2563eb";
  const SECONDARY = "#1f2a44";

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

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">Students</h1>
          <p className="page-subtitle">Manage student records</p>
        </div>

        <button
          onClick={() => {
            setEditStudent(null);
            setShowModal(true);
          }}
          className="add-btn"
        >
          + Add Student
        </button>
      </div>

      <div className="table-card">
        <StudentTable
          students={students}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* ================= MODAL ================= */}
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
