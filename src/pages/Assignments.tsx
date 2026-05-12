import React, { useState } from "react";
import Swal from "sweetalert2";
import { addAssignment } from "../services/api";

interface Props {
  students: any[];
  loadAssignments: () => void;
}

const Assignments: React.FC<Props> = ({
  students,
  loadAssignments
}) => {

  const [marksData, setMarksData] = useState<any>({});

  // ================= HANDLE INPUT =================

  const handleChange = (
    id: number,
    field: string,
    value: number
  ) => {

    // validation
    if (value < 0 || value > 100) return;

    setMarksData((prev: any) => {

      const student = prev[id] || {};

      const updated = {
        ...student,
        [field]: value
      };

      const a1 = Number(updated.assignment1 || 0);
      const a2 = Number(updated.assignment2 || 0);

      const total = a1 + a2;

      const maxMarks = 200;
      const percentage =
        maxMarks ? (total / maxMarks) * 100 : 0;

      updated.total_assignment = total;
      updated.percentage = percentage;

      return {
        ...prev,
        [id]: updated
      };

    });

  };

  // ================= SAVE (FIXED) =================

  const handleSave = async () => {

    try {

      const payload = students
        .map((student) => {

          const data = marksData[student.id];

          if (!data) return null;

          return {
            student_id: student.id,
            student_name: student.name,
            assignment1: data.assignment1 || 0,
            assignment2: data.assignment2 || 0,
            total_assignment: data.total_assignment || 0,
            percentage: data.percentage || 0,
            submission_date: new Date()
          };

        })
        .filter(Boolean);

      if (payload.length === 0) {
        Swal.fire("Warning", "No data to save", "warning");
        return;
      }

      // ✅ BULK INSERT
      await addAssignment(payload as any[]);

      Swal.fire({
        title: "Saved!",
        text: "Assignments Saved Successfully",
        icon: "success"
      });

      setMarksData({}); // reset form
      loadAssignments();

    } catch (error) {

      console.log(error);

      Swal.fire("Error", "Failed to save", "error");

    }

  };

  // ================= UI =================

  return (

    <div>

      <h2>📝 Assignments</h2>

      <table border={1}>

        <thead>
          <tr>
            <th>Student Name</th>
            <th>Assignment 1</th>
            <th>Assignment 2</th>
            <th>Total</th>
            <th>Percentage</th>
          </tr>
        </thead>

        <tbody>

          {students.map((student) => {

            const data = marksData[student.id] || {};

            return (

              <tr key={student.id}>

                <td>{student.name}</td>

                {/* Assignment 1 */}
                <td>
                  <input
                    type="number"
                    value={data.assignment1 || ""}
                    onChange={(e) => {

                      const value =
                        e.target.value === ""
                          ? 0
                          : Number(e.target.value);

                      handleChange(
                        student.id,
                        "assignment1",
                        value
                      );

                    }}
                  />
                </td>

                {/* Assignment 2 */}
                <td>
                  <input
                    type="number"
                    value={data.assignment2 || ""}
                    onChange={(e) => {

                      const value =
                        e.target.value === ""
                          ? 0
                          : Number(e.target.value);

                      handleChange(
                        student.id,
                        "assignment2",
                        value
                      );

                    }}
                  />
                </td>

                {/* Total */}
                <td>
                  {data.total_assignment || 0}
                </td>

                {/* Percentage */}
                <td>
                  {data.percentage
                    ? data.percentage.toFixed(2)
                    : 0}%
                </td>

              </tr>

            );

          })}

        </tbody>

      </table>

      <br />

      <button
        onClick={handleSave}
        disabled={
          Object.keys(marksData).length === 0
        }
      >
        Save Assignments
      </button>

    </div>

  );

};

export default Assignments;