import React, { useState } from "react";
import { Student } from "../types/Student";

interface Props {

  students: Student[];

  onEdit: (student: Student) => void;

  onDelete: (id: number) => void;

}

const StudentTable: React.FC<Props> = ({
  students,
  onEdit,
  onDelete
}) => {

  const [currentPage,
    setCurrentPage] =
    useState(1);

  const studentsPerPage = 5;

  const indexOfLastStudent =
    currentPage * studentsPerPage;

  const indexOfFirstStudent =
    indexOfLastStudent -
    studentsPerPage;

  const currentStudents =
    students.slice(
      indexOfFirstStudent,
      indexOfLastStudent
    );

  const totalPages =
    Math.ceil(
      students.length /
      studentsPerPage
    );

  return (

    <div>

      <table>

        <thead>

          <tr>

            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Course</th>
            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {currentStudents.map(
            (student) => (

              <tr key={student.id}>

                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.course}</td>

                <td>

                  <button
                    className="btn edit-btn"
                    onClick={() =>
                      onEdit(student)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="btn delete-btn"
                    onClick={() =>
                      onDelete(
                        student.id!
                      )
                    }
                  >
                    Delete
                  </button>

                </td>

              </tr>

            )
          )}

        </tbody>

      </table>

      {/* Pagination */}

      <div className="pagination">

        {Array.from(
          { length: totalPages },
          (_, index) => (

            <button
              key={index}
              className={
                currentPage ===
                index + 1
                  ? "page-btn active"
                  : "page-btn"
              }
              onClick={() =>
                setCurrentPage(
                  index + 1
                )
              }
            >
              {index + 1}
            </button>

          )
        )}

      </div>

    </div>

  );

};

export default StudentTable;