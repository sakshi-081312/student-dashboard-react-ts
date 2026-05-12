import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

interface Student {
  id?: number;
  name: string;
  email: string;
  rollno: string;
  course: string;
  image?: string | null;
}

const MyProfile = () => {
  const [form, setForm] = useState<Student>({
    name: "",
    email: "",
    rollno: "",
    course: "",
    image: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);

    const userStr = localStorage.getItem("user");
    if (!userStr) return;

    const user = JSON.parse(userStr);

    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("email", user.email)
      .single();

    if (data) {
      setForm(data); // 🔥 AUTO FILL FORM
    }

    setLoading(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const updateProfile = async () => {
    const { error } = await supabase
      .from("students")
      .update({
        name: form.name,
        rollno: form.rollno,
        course: form.course,
        image: form.image,
      })
      .eq("email", form.email);

    if (error) {
      alert(error.message);
    } else {
      alert("Profile updated successfully");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (

  <div
    className="min-h-screen flex justify-center items-center p-6"
    style={{
      background: "#0f172a", // sidebar matching background
    }}
  >

    <div
      className="w-full max-w-2xl rounded-3xl shadow-2xl p-8"
      style={{
        background: "#111827",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >

      {/* PROFILE IMAGE */}
      <div className="flex flex-col items-center mb-8">

        <div
          className="w-32 h-32 rounded-full overflow-hidden"
          style={{
            border: "4px solid #14b8a6",
            boxShadow: "0 8px 25px rgba(20,184,166,0.4)",
          }}
        >
          <img
            src={
              form.image ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            className="w-full h-full object-cover"
          />
        </div>

        <h2 className="text-3xl font-bold text-white mt-4">
          My Profile
        </h2>

        <p className="text-gray-400 text-sm mt-1">
          Manage your personal information
        </p>

      </div>

      {/* FORM */}
      <div className="space-y-5">

        {/* NAME */}
        <div>
          <label className="block text-gray-300 mb-2 text-sm">
            Full Name
          </label>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter name"
            className="w-full p-3 rounded-xl text-white outline-none"
            style={{
              background: "#1f2937",
              border: "1px solid #374151",
            }}
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="block text-gray-300 mb-2 text-sm">
            Email
          </label>

          <input
            name="email"
            value={form.email}
            disabled
            className="w-full p-3 rounded-xl text-gray-400"
            style={{
              background: "#0f172a",
              border: "1px solid #374151",
            }}
          />
        </div>

        {/* ROLL NUMBER */}
        <div>
          <label className="block text-gray-300 mb-2 text-sm">
            Roll Number
          </label>

          <input
            name="rollno"
            value={form.rollno}
            onChange={handleChange}
            placeholder="Enter roll number"
            className="w-full p-3 rounded-xl text-white outline-none"
            style={{
              background: "#1f2937",
              border: "1px solid #374151",
            }}
          />
        </div>

        {/* COURSE */}
        <div>
          <label className="block text-gray-300 mb-2 text-sm">
            Course
          </label>

          <input
            name="course"
            value={form.course}
            onChange={handleChange}
            placeholder="Enter course"
            className="w-full p-3 rounded-xl text-white outline-none"
            style={{
              background: "#1f2937",
              border: "1px solid #374151",
            }}
          />
        </div>

        {/* IMAGE URL */}
        <div>
          <label className="block text-gray-300 mb-2 text-sm">
            Image URL
          </label>

          <input
            name="image"
            value={form.image || ""}
            onChange={handleChange}
            placeholder="Paste image URL"
            className="w-full p-3 rounded-xl text-white outline-none"
            style={{
              background: "#1f2937",
              border: "1px solid #374151",
            }}
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={updateProfile}
          className="w-full p-3 rounded-xl font-semibold text-white transition-all duration-300"
          style={{
            background: "#14b8a6",
          }}
        >
          Update Profile
        </button>

      </div>

    </div>

  </div>

)
};

export default MyProfile;