import React, {
  useMemo,
  useRef,
  useState
} from "react";

import Swal from "sweetalert2";

import {
  Search,
  User
} from "lucide-react";

import { addMarks } from "../services/api";
import { Student } from "../types/Student";

interface Props {
  students: Student[];
  marks: any[];
  loadMarks: () => void;
}

const Marks: React.FC<Props> = ({
  students,
  marks,
  loadMarks
}) => {

  // ================= STATES =================

  const [search, setSearch] =
    useState("");

  const [marksData, setMarksData] =
    useState<any>({});

  const [selectedStudent, setSelectedStudent] =
    useState<Student | null>(null);

  const inputRefs =
    useRef<(HTMLInputElement | null)[]>(
      []
    );

  // ================= FILTER + SORT =================

  const filteredStudents = useMemo(() => {

    return [...students]

      .filter((student) =>
        student.name
          .toLowerCase()
          .includes(search.toLowerCase())
      )

      .sort((a, b) =>
        a.name.localeCompare(b.name)
      );

  }, [students, search]);

  // ================= HANDLE CHANGE =================

  const handleChange = (
    studentId: number,
    field: string,
    value: string
  ) => {

    setMarksData((prev: any) => ({
      ...prev,

      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));

  };

  // ================= NEXT INPUT =================

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {

    if (e.key === "Enter") {

      e.preventDefault();

      inputRefs.current[index + 1]?.focus();

    }

  };

  // ================= TOTAL =================

  const getTotal = (id: number) => {

    const mst1 =
      Number(marksData[id]?.mst1 || 0);

    const mst2 =
      Number(marksData[id]?.mst2 || 0);

    return mst1 + mst2;

  };

  // ================= SAVE =================

  const handleSave = async () => {

    try {

      for (const student of filteredStudents) {

        if (!student.id) continue;

        const data =
          marksData[student.id];

        if (!data) continue;

        await addMarks({

          student_id: student.id,

          student_name: student.name,

          mst1:
            Number(data.mst1 || 0),

          mst2:
            Number(data.mst2 || 0)

        });

      }

      Swal.fire({
        icon: "success",
        title: "Saved",
        text: "Marks added successfully"
      });

      loadMarks();

    } catch (error) {

      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save marks"
      });

    }

  };

  // ================= UI =================

  return (

    <div
      style={{
        padding: "15px",
        background: "#f8fafc",
        minHeight: "100vh"
      }}
    >

      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "15px",
          flexWrap: "wrap",
          gap: "10px"
        }}
      >

        <h2
          style={{
            margin: 0,
            color: "#0f172a"
          }}
        >
          📊 Marks Entry
        </h2>

        <button
          onClick={handleSave}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding:
              "10px 18px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 600
          }}
        >
          Save Marks
        </button>

      </div>

      {/* SEARCH */}

      <div
        style={{
          position: "relative",
          marginBottom: "15px"
        }}
      >

        <Search
          size={18}
          style={{
            position: "absolute",
            top: "11px",
            left: "10px",
            color: "#64748b"
          }}
        />

        <input
          type="text"
          placeholder="Search student..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            width: "100%",
            padding:
              "10px 10px 10px 35px",
            borderRadius: "8px",
            border:
              "1px solid #cbd5e1",
            outline: "none"
          }}
        />

      </div>

      {/* TABLE */}

      <div
        style={{
          overflowX: "auto",
          background: "white",
          borderRadius: "12px",
          boxShadow:
            "0 2px 10px rgba(0,0,0,0.08)"
        }}
      >

        <table
          style={{
            width: "100%",
            borderCollapse:
              "collapse",
            tableLayout: "fixed"
          }}
        >

          <thead>

            <tr
              style={{
                background:
                  "#2563eb",
                color: "white"
              }}
            >

              <th
                style={{
                  ...thStyle,
                  width: "40%"
                }}
              >
                Student
              </th>

              <th
                style={{
                  ...thStyle,
                  width: "15%"
                }}
              >
                MST 1
              </th>

              <th
                style={{
                  ...thStyle,
                  width: "15%"
                }}
              >
                MST 2
              </th>

              <th
                style={{
                  ...thStyle,
                  width: "15%"
                }}
              >
                Total
              </th>

              <th
                style={{
                  ...thStyle,
                  width: "15%"
                }}
              >
                Profile
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredStudents.map(
              (
                student,
                index
              ) => {

                const duplicateNames =
                  students.filter(
                    (s) =>
                      s.name ===
                      student.name
                  );

                return (

                  <tr
                    key={
                      student.id ||
                      index
                    }
                    style={{
                      borderBottom:
                        "1px solid #e2e8f0"
                    }}
                  >

                    {/* NAME */}

                    <td style={tdStyle}>

                      <div
                        style={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap: "10px"
                        }}
                      >

                        <div
                          style={{
                            width: "35px",
                            height:
                              "35px",
                            borderRadius:
                              "50%",
                            background:
                              "#2563eb",
                            color:
                              "white",
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            fontWeight:
                              700,
                            flexShrink: 0
                          }}
                        >
                          {student.name
                            ?.charAt(0)
                            ?.toUpperCase()}
                        </div>

                        <div
                          style={{
                            overflow:
                              "hidden"
                          }}
                        >

                          <div
                            style={{
                              fontWeight:
                                600,
                              whiteSpace:
                                "nowrap",
                              overflow:
                                "hidden",
                              textOverflow:
                                "ellipsis"
                            }}
                          >
                            {
                              student.name
                            }
                          </div>

                          {duplicateNames.length >
                            1 && (

                            <div
                              style={{
                                fontSize:
                                  "11px",
                                color:
                                  "#64748b"
                              }}
                            >
                              Roll:
                              {
                                student.rollno
                              }
                            </div>

                          )}

                        </div>

                      </div>

                    </td>

                    {/* MST1 */}

                    <td style={tdStyle}>

                      <input
                        ref={(el) => {
                          inputRefs.current[
                            index *
                              2
                          ] = el;
                        }}

                        type="number"

                        value={
                          student.id
                            ? marksData[
                                student.id
                              ]?.mst1 || ""
                            : ""
                        }

                        onChange={(
                          e
                        ) =>
                          student.id &&
                          handleChange(
                            student.id,
                            "mst1",
                            e.target
                              .value
                          )
                        }

                        onKeyDown={(
                          e
                        ) =>
                          handleKeyDown(
                            e,
                            index *
                              2
                          )
                        }

                        placeholder="MST1"

                        style={
                          inputStyle
                        }
                      />

                    </td>

                    {/* MST2 */}

                    <td style={tdStyle}>

                      <input
                        ref={(el) => {
                          inputRefs.current[
                            index *
                              2 +
                              1
                          ] = el;
                        }}

                        type="number"

                        value={
                          student.id
                            ? marksData[
                                student.id
                              ]?.mst2 || ""
                            : ""
                        }

                        onChange={(
                          e
                        ) =>
                          student.id &&
                          handleChange(
                            student.id,
                            "mst2",
                            e.target
                              .value
                          )
                        }

                        onKeyDown={(
                          e
                        ) =>
                          handleKeyDown(
                            e,
                            index *
                              2 +
                              1
                          )
                        }

                        placeholder="MST2"

                        style={
                          inputStyle
                        }
                      />

                    </td>

                    {/* TOTAL */}

                    <td
                      style={{
                        ...tdStyle,
                        fontWeight:
                          700,
                        color:
                          "#16a34a"
                      }}
                    >
                      {student.id
                        ? getTotal(
                            student.id
                          )
                        : 0}
                    </td>

                    {/* PROFILE */}

                    <td style={tdStyle}>

                      <button
                        onClick={() =>
                          setSelectedStudent(
                            student
                          )
                        }
                        style={{
                          border:
                            "none",
                          background:
                            "#dbeafe",
                          width:
                            "35px",
                          height:
                            "35px",
                          borderRadius:
                            "50%",
                          cursor:
                            "pointer"
                        }}
                      >
                        <User
                          size={16}
                        />
                      </button>

                    </td>

                  </tr>

                );

              }
            )}

          </tbody>

        </table>

      </div>

    </div>

  );

};

// ================= STYLES =================

const thStyle:
  React.CSSProperties = {

  padding: "10px",
  textAlign: "left",
  fontSize: "14px"

};

const tdStyle:
  React.CSSProperties = {

  padding: "6px",
  fontSize: "13px",
  whiteSpace: "nowrap"

};

const inputStyle:
  React.CSSProperties = {

  width: "60px",
  padding: "6px",
  border:
    "1px solid #cbd5e1",
  borderRadius: "6px",
  textAlign: "center",
  outline: "none"

  
};

export default Marks;