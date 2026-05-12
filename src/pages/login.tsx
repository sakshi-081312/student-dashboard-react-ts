import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import { Lock, User } from "lucide-react";

import { signInUser } from "../services/auth";

export default function LoginPage() {
  const { completeMfaLogin } = useAuth();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // ================= LOGIN =================
  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      // ================= LOGIN API =================
      const res = await signInUser(email, password);

      console.log("Login Response:", res);

      // ================= SUCCESS =================
      if (res?.success && res?.user && res?.token) {

        // SAVE USER + TOKEN
        completeMfaLogin(res.user, res.token);

        alert("Login successful");

        const role = res.user.role;

        // ================= ROLE BASED REDIRECT =================
        switch (role) {

          case "admin":
            navigate("/");
            break;

          case "teacher":
            navigate("/students");
            break;

          case "student":
            navigate("/student-information");
            break;

          default:
            navigate("/");
        }

      } else {
        alert(res?.message || "Invalid email or password");
      }

    } catch (error) {

      console.error("Login Error:", error);

      alert("Something went wrong");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="login-container">

      <div className="login-card">

        {/* HEADER */}
        <div className="login-header">

          <div className="icon-box">
            <Lock size={28} />
          </div>

          <h2>Student Management System</h2>

          <p>Login to continue</p>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleLogin}
          className="login-form"
        >

          {/* EMAIL */}
          <div className="input-box">

            <User size={18} />

            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              disabled={loading}
              autoComplete="email"
            />

          </div>

          {/* PASSWORD */}
          <div className="input-box">

            <Lock size={18} />

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              disabled={loading}
              autoComplete="current-password"
            />

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={
              loading ||
              !email ||
              !password
            }
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

      </div>

    </div>
  );
}