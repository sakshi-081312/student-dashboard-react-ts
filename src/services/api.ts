import { Student } from "../types/Student";

const BASE_URL = "https://student-dashboard-react-ts-18kt.vercel.app";

// GET
export const getStudents = async () => {
  const res = await fetch(BASE_URL);
  return res.json();
};

// ADDn
export const addStudent = async (
  student: Student
) => {

  return fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(student)
  });

};

// UPDATE
export const updateStudent = async (
  id: number,
  student: Student
) => {

  return fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(student)
  });

};

// DELETE
export const deleteStudent = async (
  id: number
) => {

  return fetch(`${BASE_URL}/${id}`, {
    method: "DELETE"
  });

};