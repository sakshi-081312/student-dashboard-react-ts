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

import "./App.css";

function App() {

  // =========================
  // STATES
  // =========================

  const [students, setStudents] =
    useState<Student[]>([]);

  const [showModal, setShowModal] =
    useState(false);

  const [editStudent,
    setEditStudent] =
    useState<Student | null>(null);

  // =========================
  // LOAD STUDENTS
  // =========================

  const loadStudents = async () => {

    try {

      const res = await getStudents();

      console.log("API Response:", res);

      // 🔥 FIX students.slice error
      let studentData =
        res.data || res || [];

      // Ensure it's array
      if (!Array.isArray(studentData)) {

        studentData =
          studentData.data || [];

      }

      // 🔥 Latest record first
      studentData =
        studentData.reverse();

      setStudents(studentData);

    } catch (error) {

      console.error(
        "Error loading students:",
        error
      );

      Swal.fire({
        title: "Error!",
        text: "Failed to load students.",
        icon: "error"
      });

    }

  };

  useEffect(() => {

    loadStudents();

  }, []);

  // =========================
  // SAVE STUDENT
  // =========================

  const handleSave = async (
    student: Student
  ) => {

    try {

      if (editStudent) {

        await updateStudent(
          editStudent.id!,
          student
        );

        setShowModal(false);
        setEditStudent(null);

        await Swal.fire({
          title: "Updated!",
          text:
            "Student updated successfully.",
          icon: "success"
        });

      } else {

        await addStudent(student);

        setShowModal(false);
        setEditStudent(null);

        await Swal.fire({
          title: "Added!",
          text:
            "Student added successfully.",
          icon: "success"
        });

      }

      await loadStudents();

    } catch (error) {

      console.error(error);

      Swal.fire({
        title: "Error!",
        text:
          "Failed to save student.",
        icon: "error"
      });

    }

  };

  // =========================
  // DELETE STUDENT
  // =========================

  const handleDelete = async (
    id: number
  ) => {

    const result =
      await Swal.fire({

        title: "Are you sure?",

        text:
          "You won't be able to undo this!",

        icon: "warning",

        showCancelButton: true,

        confirmButtonColor:
          "#e74c3c",

        cancelButtonColor:
          "#3085d6",

        confirmButtonText:
          "Yes, delete it!"

      });

    if (result.isConfirmed) {

      try {

        await deleteStudent(id);

        await Swal.fire({
          title: "Deleted!",
          text:
            "Student deleted successfully.",
          icon: "success"
        });

        await loadStudents();

      } catch (error) {

        console.error(
          "Delete error:",
          error
        );

        Swal.fire({
          title: "Error!",
          text:
            "Failed to delete student.",
          icon: "error"
        });

      }

    }

  };

  // =========================
  // EDIT STUDENT
  // =========================

  const handleEdit = (
    student: Student
  ) => {

    setEditStudent(student);

    setShowModal(true);

  };

  // =========================
  // ADD STUDENT FIX (IMPORTANT)
  // =========================

  const handleAddStudent = () => {

    // 🔥 CLEAR OLD EDIT DATA
    setEditStudent(null);

    // OPEN EMPTY FORM
    setShowModal(true);

  };

  // =========================
  // UI
  // =========================

  return (

    <div>

      <Navbar />

      <Sidebar />

      <div className="main">

        <h2>
          Students Management
        </h2>

        {/* ADD BUTTON */}

        <button
          className="btn add-btn"
          onClick={handleAddStudent}
        >
          + Add Student
        </button>

        {/* STUDENT TABLE */}

        <StudentTable
          students={
            Array.isArray(students)
              ? students
              : []
          }
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* MODAL */}

        <StudentModal
          show={showModal}
          onClose={() =>
            setShowModal(false)
          }
          onSave={handleSave}
          editStudent={editStudent}
        />

      </div>

    </div>

  );

}

export default App;