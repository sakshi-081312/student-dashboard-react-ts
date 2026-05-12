import { supabase } from "../supabaseClient";
import { Student } from "../types/Student";

// ================= STUDENTS =================

export const getStudents = async () => {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .order("id", { ascending: false });

  if (error) throw error;
  return data || [];
};

export const addStudent = async (student: Student) => {
  const { data, error } = await supabase
    .from("students")
    .insert([student])
    .select();

  if (error) throw error;
  return data;
};

// ✅ FIXED (IMPORTANT)
export const updateStudent = async (id: number, student: Student) => {

  // ❌ remove id before update
  const { id: _, ...cleanStudent } = student;

  const { data, error } = await supabase
    .from("students")
    .update(cleanStudent)
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
};

export const deleteStudent = async (id: number) => {
  const { error } = await supabase
    .from("students")
    .delete()
    .eq("id", id);

  if (error) throw error;
};


// ================= ATTENDANCE =================

export const getAttendance = async () => {
  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .order("id", { ascending: false });

  if (error) throw error;
  return data || [];
};

export const addAttendance = async (attendanceList: any[]) => {

  const formatted = attendanceList.map((a) => ({
    student_id: a.student_id,
    student_name: a.student_name,
    date: a.date,
    status: a.status
  }));

  const { data, error } = await supabase
    .from("attendance")
    .insert(formatted)
    .select();

  if (error) throw error;
  return data;
};

export const deleteAttendance = async (id: number) => {
  const { error } = await supabase
    .from("attendance")
    .delete()
    .eq("id", id);

  if (error) throw error;
};


// ================= ASSIGNMENTS =================

export const getAssignments = async () => {
  const { data, error } = await supabase
    .from("assignments")
    .select("*")
    .order("id", { ascending: false });

  if (error) throw error;
  return data || [];
};

export const addAssignment = async (assignments: any[]) => {

  const formatted = assignments.map((a) => {

    const total =
      Number(a.assignment1 || 0) +
      Number(a.assignment2 || 0);

    const maxMarks = 200;

    const percentage =
      maxMarks ? (total / maxMarks) * 100 : 0;

    return {
      student_id: a.student_id,
      student_name: a.student_name,
      assignment1: a.assignment1 || 0,
      assignment2: a.assignment2 || 0,
      total_assignment: total,
      percentage: percentage,
      submission_date: new Date()
    };

  });

  const { data, error } = await supabase
    .from("assignments")
    .insert(formatted)
    .select();

  if (error) throw error;
  return data;
};

export const deleteAssignment = async (id: number) => {
  const { error } = await supabase
    .from("assignments")
    .delete()
    .eq("id", id);

  if (error) throw error;
};


// ================= MARKS =================

export const getMarks = async () => {
  const { data, error } = await supabase
    .from("marks")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.log("Marks Fetch Error:", error);
    return [];
  }

  return data || [];
};

export const addMarks = async (marks: any) => {

  const { data, error } = await supabase
    .from("marks")
    .insert([{
      student_id: marks.student_id,
      student_name: marks.student_name,
      mst1: marks.mst1 || 0,
      mst2: marks.mst2 || 0
    }])
    .select();

  if (error) {
    console.log("Marks Insert Error:", error);
    throw error;
  }

  return data;
};