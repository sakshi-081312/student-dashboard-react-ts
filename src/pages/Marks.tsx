import React, { useState } from "react";
import Swal from "sweetalert2";
import { addMarks } from "../services/api";

interface Props {
  students: any[];
  marks: any[];
  loadMarks: () => void;
}

const Marks: React.FC<Props> = ({
  students,
  marks,
  loadMarks
}) => {

  const [marksData, setMarksData] = useState<any>({});

  // ================= HANDLE INPUT =================

  const handleChange = (
    id: number,
    field: string,
    value: number
  ) => {

    const existing = marksData[id] || {};

    setMarksData({
      ...marksData,
      [id]: {
        ...existing,
        [field]: value
      }
    });
  };

  // ================= SAVE =================

  const handleSave = async () => {

    try {

      for (let student of students) {

        const data = marksData[student.id];

        if (!data) continue;

        await addMarks({
          student_id: student.id,
          student_name: student.name,
          mst1: data.mst1 || 0,
          mst2: data.mst2 || 0
        });

      }

      Swal.fire("Success", "Marks saved successfully", "success");

      loadMarks();

    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Failed to save marks", "error");
    }

  };

  // ================= UI =================

  return (

    <div>

      <h2>📊 Marks Entry</h2>

      <table border={1} style={{ width: "100%" }}>

        <thead>
          <tr>
            <th>Student</th>
            <th>MST 1</th>
            <th>MST 2</th>
          </tr>
        </thead>

        <tbody>

          {students.map((student) => {

            const data = marksData[student.id] || {};

            return (
              <tr key={student.id}>

                <td>{student.name}</td>

                <td>
                  <input
                    type="number"
                    value={data.mst1 || ""}
                    onChange={(e) =>
                      handleChange(
                        student.id,
                        "mst1",
                        Number(e.target.value)
                      )
                    }
                  />
                </td>

                <td>
                  <input
                    type="number"
                    value={data.mst2 || ""}
                    onChange={(e) =>
                      handleChange(
                        student.id,
                        "mst2",
                        Number(e.target.value)
                      )
                    }
                  />
                </td>

              </tr>
            );

          })}

        </tbody>

      </table>

      <br />

      <button onClick={handleSave}>
        Save Marks
      </button>

    </div>

  );

};

export default Marks;