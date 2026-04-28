import React, { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import StudentTable from "./components/StudentTable";
import StudentModal from "./components/StudentModal";

import {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent
} from "./services/api";

import { Student } from "./types/Student";

import Swal from "sweetalert2";

import './App.css'
function App() {
  // ================= STATE =================
  const [students, setStudents] = useState<Student[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);

  // ================= LOAD DATA =================
  const loadStudents = async () => {
    try {
      const res = await getStudents();

      // handle different API response formats safely
      const data =
        res?.data || res || [];

      if (Array.isArray(data)) {
        setStudents(data.reverse()); // latest first
      } else {
        setStudents([]);
      }

    } catch (error) {
      console.error("Load error:", error);

      Swal.fire({
        title: "Error!",
        text: "Failed to load students",
        icon: "error"
      });
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // ================= ADD / EDIT SAVE =================
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
      loadStudents();

    } catch (error) {
      console.error(error);

      Swal.fire("Error!", "Failed to save student", "error");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteStudent(id);

        Swal.fire("Deleted!", "Student removed", "success");

        loadStudents();
      } catch (error) {
        console.error(error);

        Swal.fire("Error!", "Delete failed", "error");
      }
    }
  };

  // ================= EDIT =================
  const handleEdit = (student: Student) => {
    setEditStudent(student);
    setShowModal(true);
  };

  // ================= ADD (IMPORTANT FIX) =================
  const handleAdd = () => {
    setEditStudent(null); // clear edit mode
    setShowModal(true);
  };

  return (
    <div>
      <Navbar />
      <Sidebar />

      <div className="main">
        <h2>Students Management</h2>

        <button className="btn add-btn" onClick={handleAdd}>
          + Add Student
        </button>

        <StudentTable
          students={students}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

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
    </div>
  );
}

export default App;