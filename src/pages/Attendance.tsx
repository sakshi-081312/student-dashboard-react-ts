import React, { useMemo, useState } from "react";

import Swal from "sweetalert2";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import { addAttendance } from "../services/api";

import { Student } from "../types/Student";

interface Props {
  students: Student[];
  loadAttendance: () => void;
}

const Attendance: React.FC<Props> = ({
  students,
  loadAttendance,
}) => {
  const [attendanceData, setAttendanceData] =
    useState<Record<string, boolean>>({});

  const [showCalendar, setShowCalendar] =
    useState(false);

  const today = new Date()
    .toISOString()
    .split("T")[0];

  // ================= SORT STUDENTS =================
  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [students]);

  // ================= PRESENT CHECK =================
  const isPresent = (
    id?: number
  ) => {
    if (!id) return false;

    const key = `${id}|${today}`;

    return attendanceData[key] || false;
  };

  // ================= TOGGLE =================
  const toggleAttendance = (
    studentId?: number
  ) => {
    if (!studentId) return;

    const key = `${studentId}|${today}`;

    setAttendanceData((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ================= COUNTS =================
  const presentCount =
    sortedStudents.filter((s) =>
      isPresent(s.id)
    ).length;

  const absentCount =
    sortedStudents.length -
    presentCount;

  // ================= SAVE =================
  const handleSaveAll = async () => {
    const payload =
      sortedStudents
        .filter((student) => student.id)
        .map((student) => ({
          student_id: student.id,
          student_name: student.name,
          rollno:
            student.rollno || "",
          date: today,
          status: isPresent(
            student.id
          )
            ? "Present"
            : "Absent",
        }));

    try {
      await addAttendance(payload);

      Swal.fire(
        "Saved",
        "Attendance saved successfully",
        "success"
      );

      loadAttendance();
    } catch (error) {
      Swal.fire(
        "Error",
        "Something went wrong",
        "error"
      );
    }
  };

  // ================= ABSENT EVENTS =================
  const absentEvents = useMemo(() => {
    return sortedStudents
      .filter(
        (student) =>
          !isPresent(student.id)
      )
      .map((student) => ({
        title: `${student.name} Absent`,
        date: today,
        backgroundColor: "#dc2626",
        borderColor: "#dc2626",
      }));
  }, [attendanceData, sortedStudents]);

  return (
    <div
      style={{
        padding: 20,
        background: "#f8fafc",
        minHeight: "100vh",
        fontFamily: "Arial",
      }}
    >
      {/* ================= HEADER ================= */}
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: 25,
          flexWrap: "wrap",
          gap: 15,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 34,
              fontWeight: "bold",
              color: "#0f172a",
            }}
          >
            E.C.E Attendance
          </h1>

          <p
            style={{
              marginTop: 6,
              color: "#64748b",
            }}
          >
            Quick attendance panel
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={handleSaveAll}
            style={{
              padding:
                "12px 18px",
              border: "none",
              borderRadius: 10,
              background:
                "#16a34a",
              color: "white",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            💾 Save Attendance
          </button>

          <button
            onClick={() =>
              setShowCalendar(true)
            }
            style={{
              padding:
                "12px 18px",
              border: "none",
              borderRadius: 10,
              background:
                "#0f172a",
              color: "white",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            📅 Calendar
          </button>
        </div>
      </div>

      {/* ================= SUMMARY ================= */}
      <div
        style={{
          display: "flex",
          gap: 15,
          marginBottom: 25,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: 14,
            padding: 18,
            minWidth: 180,
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#64748b",
            }}
          >
            Total Students
          </p>

          <h2>{sortedStudents.length}</h2>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: 14,
            padding: 18,
            minWidth: 180,
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#16a34a",
            }}
          >
            Present
          </p>

          <h2>{presentCount}</h2>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: 14,
            padding: 18,
            minWidth: 180,
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#dc2626",
            }}
          >
            Absent
          </p>

          <h2>{absentCount}</h2>
        </div>
      </div>

      {/* ================= STUDENTS GRID ================= */}
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 20,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(5, minmax(0, 1fr))",
            gap: 12,
          }}
        >
          {sortedStudents.map(
            (student) => {
              const checked =
                isPresent(
                  student.id
                );

              // FIRST NAME
              const firstName =
                student.name
                  .trim()
                  .split(" ")[0]
                  .toLowerCase();

              // SAME FIRST NAME COUNT
              const sameNameCount =
                sortedStudents.filter(
                  (s) =>
                    s.name
                      .trim()
                      .split(" ")[0]
                      .toLowerCase() ===
                    firstName
                ).length;

              return (
                <div
                  key={student.id}
                  style={{
                    display: "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "space-between",
                    gap: 8,
                    padding:
                      "10px 12px",
                    borderRadius: 10,
                    background:
                      checked
                        ? "#dcfce7"
                        : "#f8fafc",
                    border:
                      checked
                        ? "1px solid #22c55e"
                        : "1px solid #e2e8f0",
                    minHeight: 55,
                  }}
                >
                  {/* LEFT */}
                  <div
                    style={{
                      overflow:
                        "hidden",
                    }}
                  >
                    {/* NAME */}
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color:
                          "#0f172a",
                        whiteSpace:
                          "nowrap",
                        overflow:
                          "hidden",
                        textOverflow:
                          "ellipsis",
                      }}
                    >
                      {student.name}
                    </div>

                    {/* ROLL NO IF SAME NAME */}
                    {sameNameCount >
                      1 && (
                      <div
                        style={{
                          fontSize: 11,
                          color:
                            "#64748b",
                          marginTop: 2,
                        }}
                      >
                        Roll No:{" "}
                        {
                          student.rollno
                        }
                      </div>
                    )}
                  </div>

                  {/* CHECKBOX */}
                  <input
                    type="checkbox"
                    checked={
                      checked
                    }
                    onChange={() =>
                      toggleAttendance(
                        student.id
                      )
                    }
                    style={{
                      width: 18,
                      height: 18,
                      cursor:
                        "pointer",
                      flexShrink: 0,
                    }}
                  />
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* ================= CALENDAR ================= */}
      {showCalendar && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent:
              "center",
            alignItems: "center",
            zIndex: 999,
            padding: 20,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 950,
              background:
                "white",
              padding: 20,
              borderRadius: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
                marginBottom: 15,
              }}
            >
              <h2
                style={{
                  margin: 0,
                  color: "#0f172a",
                }}
              >
                Absent Students Calendar
              </h2>

              <button
                onClick={() =>
                  setShowCalendar(
                    false
                  )
                }
                style={{
                  border: "none",
                  background:
                    "#fee2e2",
                  color: "#dc2626",
                  width: 35,
                  height: 35,
                  borderRadius: 8,
                  fontSize: 18,
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                ✖
              </button>
            </div>

            <FullCalendar
              plugins={[
                dayGridPlugin,
                interactionPlugin,
              ]}
              initialView="dayGridMonth"
              height={500}
              events={absentEvents}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;