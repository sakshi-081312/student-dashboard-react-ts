import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient";
import Swal from "sweetalert2";

interface Student {
  id?: number;
  name: string;
  email: string;
  rollno: string;
  course: string;
  image?: string | null;
}

const PersonalInfo = () => {
  const [student, setStudent] = useState<Student>({
    name: "",
    email: "",
    rollno: "",
    course: "",
    image: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  // ===============================
  // FETCH STUDENT
  // ===============================
  const fetchStudent = async () => {
    setLoading(true);

    const email = user?.email;

    if (!email) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });

      setLoading(false);
      return;
    }

    if (data) {
      setStudent(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchStudent();
  }, []);

  // ===============================
  // HANDLE INPUT CHANGE
  // ===============================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  };

  // ===============================
  // OPEN FILE PICKER
  // ===============================
  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  // ===============================
  // IMAGE UPLOAD
  // ===============================
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // ALLOWED TYPES
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid File",
        text:
          "Only PNG, JPG, JPEG, WEBP images allowed",
      });

      return;
    }

    // FILE SIZE LIMIT 2MB
    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
      Swal.fire({
        icon: "warning",
        title: "File Too Large",
        text: "File size must be less than 2MB",
      });

      return;
    }

    // FORM DATA
    const formData = new FormData();
    formData.append("image", file);

    try {
      // SEND IMAGE TO EXPRESS SERVER
      const response = await fetch(
        "http://localhost:5000/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!result.success) {
        Swal.fire({
          icon: "error",
          title: "Upload Failed",
          text: result.message,
        });

        return;
      }

      const imageUrl = result.imageUrl;

      // UPDATE STATE
      setStudent((prev) => ({
        ...prev,
        image: imageUrl,
      }));

      // SAVE URL IN SUPABASE
      const { error } = await supabase
        .from("students")
        .update({
          image: imageUrl,
        })
        .eq("email", student.email);

      if (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message,
        });

        return;
      }

      // SUCCESS MESSAGE
      Swal.fire({
        icon: "success",
        title: "Success",
        text:
          "Profile image updated successfully!",
        confirmButtonColor: "#2c3e50",
      });

    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Something went wrong",
      });
    }
  };

  // ===============================
  // UPDATE PROFILE
  // ===============================
  const handleUpdate = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setSaving(true);

    const { error } = await supabase
      .from("students")
      .update({
        name: student.name,
        rollno: student.rollno,
        course: student.course,
      })
      .eq("email", student.email);

    setSaving(false);

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Profile updated successfully!",
        confirmButtonColor: "#2c3e50",
      });
    }
  };

  // ===============================
  // LOADING
  // ===============================
  if (loading) {
    return (
      <h3 style={{ textAlign: "center" }}>
        Loading...
      </h3>
    );
  }

  // ===============================
  // INPUT STYLE
  // ===============================
  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
  };

  // ===============================
  // UI
  // ===============================
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#eef2f7",
      }}
    >
      <div
        style={{
          width: "380px",
          background: "#fff",
          borderRadius: "20px",
          padding: "25px",
          boxShadow:
            "0 10px 25px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        {/* PROFILE IMAGE */}
        <div
          style={{
            position: "relative",
            display: "inline-block",
            marginBottom: "15px",
          }}
        >
          <img
            src={
              student.image ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt="profile"
            style={{
              width: "110px",
              height: "110px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "4px solid #2c3e50",
            }}
          />

          {/* PEN ICON */}
          <div
            onClick={handleIconClick}
            style={{
               position: "absolute",
  bottom: "5px",
  right: "5px",
  width: "30px",
  height: "30px",
  borderRadius: "50%",
  background: "#2c3e50",
  color: "#fff",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  fontSize: "14px",
            }}
          >
            ✏️
          </div>

          {/* HIDDEN FILE INPUT */}
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
        </div>

        <h2
          style={{
            marginBottom: "20px",
            color: "#333",
          }}
        >
          My Profile
        </h2>

        {/* FORM */}
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            name="name"
            value={student.name}
            onChange={handleChange}
            placeholder="Full Name"
            style={inputStyle}
          />

          <input
            type="text"
            name="email"
            value={student.email}
            disabled
            style={{
              ...inputStyle,
              background: "#f5f5f5",
            }}
          />

          <input
            type="text"
            name="rollno"
            value={student.rollno}
            onChange={handleChange}
            placeholder="Roll No"
            style={inputStyle}
          />

          <input
            type="text"
            name="course"
            value={student.course}
            onChange={handleChange}
            placeholder="Course"
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={saving}
            style={{
              width: "100%",
              padding: "12px",
              border: "none",
              borderRadius: "10px",
              background: "#2c3e50",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            {saving
              ? "Saving..."
              : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PersonalInfo;