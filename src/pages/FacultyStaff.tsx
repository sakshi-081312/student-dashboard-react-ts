import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// ================= SUPABASE CONNECTION =================
const supabase = createClient(
  "YOUR_SUPABASE_URL",
  "YOUR_SUPABASE_ANON_KEY"
);

const FacultyStaff = () => {

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH DATA =================
  const fetchFaculty = async () => {
    const { data, error } = await supabase
      .from("faculty_staff")
      .select("*");

    if (error) {
      console.log(error);
    } else {
      setData(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  return (
    <div style={styles.wrapper}>

      <h2 style={styles.title}>👨‍🏫 Faculty & Staff</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={styles.grid}>

          {data.map((item) => (
            <div key={item.id} style={styles.card}>

              <h3>{item.name}</h3>
              <p>📧 {item.email}</p>
              <p>📞 {item.phone || "N/A"}</p>

              <hr />

              <p><b>Designation:</b> {item.designation}</p>
              <p><b>Department:</b> {item.department}</p>
              <p><b>Experience:</b> {item.experience}</p>
              <p><b>Specialization:</b> {item.specialization}</p>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

// ================= STYLES =================
const styles: any = {

  wrapper: {
    padding: "20px",
    background: "#f4f6f9",
    minHeight: "100vh"
  },

  title: {
    marginBottom: "20px",
    color: "#111827"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "15px"
  },

  card: {
    background: "white",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
  }
};

export default FacultyStaff;