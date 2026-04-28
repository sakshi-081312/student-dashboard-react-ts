import React, { useState, useEffect } from "react";
import { Student } from "../types/Student";

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

  const [student, setStudent] =
    useState<Student>({
      name: "",
      email: "",
      phone: "",
      course: "",
      age: 0
    });

  useEffect(() => {

    if (editStudent) {
      setStudent(editStudent);
    }

  }, [editStudent]);

  if (!show) return null;

  return (

    <div className="modal">

      <div className="modal-box">

        <h3>
          {editStudent
            ? "Edit Student"
            : "Add Student"}
        </h3>

        <input
          placeholder="Name"
          value={student.name}
          onChange={(e) =>
            setStudent({
              ...student,
              name: e.target.value
            })
          }
        />

        <input
          placeholder="Email"
          value={student.email}
          onChange={(e) =>
            setStudent({
              ...student,
              email: e.target.value
            })
          }
        />

        <input
          placeholder="Phone"
          value={student.phone}
          onChange={(e) =>
            setStudent({
              ...student,
              phone: e.target.value
            })
          }
        />

        <input
          placeholder="Course"
          value={student.course}
          onChange={(e) =>
            setStudent({
              ...student,
              course: e.target.value
            })
          }
        />

        <input
          placeholder="Age"
          value={student.age}
          onChange={(e) =>
            setStudent({
              ...student,
              age: Number(e.target.value)
            })
          }
        />

        <button
          className="btn add-btn"
          onClick={() =>
            onSave(student)
          }
        >
          Save
        </button>

        <button
          className="btn delete-btn"
          onClick={onClose}
        >
          Close
        </button>

      </div>

    </div>

  );

};

export default StudentModal;