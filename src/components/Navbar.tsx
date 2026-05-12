import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <div className="navbar">

      {/* LEFT SIDE */}
      <div className="navbar-left">
        <h2 className="navbar-title">
          Student Management System
        </h2>
      </div>

      {/* RIGHT SIDE */}
      <div className="navbar-right">
        <button
          onClick={logout}
          className="logout-btn"
        >
          Logout
        </button>
      </div>

    </div>
  );
}