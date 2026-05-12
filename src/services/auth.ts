import { supabase } from "../supabaseClient";

// ================= LOGIN =================
export const signInUser = async (
  email: string,
  password: string
) => {
  console.log("LOGIN EMAIL:", email);
  console.log("LOGIN PASSWORD:", password);

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email)
    .eq("password", password)
    .single();

  if (error) {
    console.log("LOGIN ERROR:", error);

    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    user: data,
    token: "demo-token",
  };
};

// ================= SIGNUP =================
export const signUpUser = async (
  name: string,
  email: string,
  password: string,
  role: "admin" | "teacher" | "student"
) => {
  console.log("SIGNUP:", name, email, password, role);

  const { data, error } = await supabase
    .from("profiles")
    .insert([
      {
        name,
        email,
        password,
        role,
      },
    ])
    .select()
    .single();

  if (error) {
    console.log("SIGNUP ERROR:", error);

    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    user: data,
  };
};