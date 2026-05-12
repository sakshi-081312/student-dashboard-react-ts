import { useState } from "react";
import { signUpUser } from "../services/auth";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const handleSignup = async () => {
    try {
      const res = await signUpUser(
        name,
        email,
        password,
        role as "admin" | "teacher" | "student"
      );

      if (res.success) {
        alert("Signup successful");
        navigate("/login");
      } else {
        alert(res.message);
      }
    } catch (err: any) {
      console.log(err);
      alert("Signup failed");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Signup</h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br />
      <br />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />
      <br />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
        <option value="admin">Admin</option>
      </select>

      <br />
      <br />

      <button onClick={handleSignup}>
        Signup
      </button>
    </div>
  );
};

export default Signup;