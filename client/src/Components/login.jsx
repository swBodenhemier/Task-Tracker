import { NavLink, useOutletContext, useNavigate } from "react-router";
import { useState } from "react";

export default function LogIn() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [disableConfirm, setDisableConfirm] = useState(true);
  const { setUser } = useOutletContext();
  const navigate = useNavigate();

  async function log_in() {
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // login successful
        setUser(data.user.username); // updated to match backend
        navigate("/tasks");
      } else {
        // login failed
        alert(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Server error during login");
    }
  }

  function validateFormData() {
    setDisableConfirm(formData.username === "" || formData.password === "");
  }

  return (
    <div className="flex flex-col items-center py-40">
      <div className="segment flex flex-col items-center gap-6">
        <span className="text-lg text-center">
          Please enter your credentials below.
        </span>
        <span>
          Don't have an account?{" "}
          <NavLink className="text-blue-600 underline" to="/signup">
            Sign Up
          </NavLink>
        </span>
        <span className="flex flex-col gap-4 w-full">
          <label>
            <span>Username: </span>
            <input
              value={formData.username}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, username: e.target.value }));
                validateFormData();
              }}
            />
          </label>
          <label>
            <span>Password: </span>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, password: e.target.value }));
                validateFormData();
              }}
            />
          </label>
        </span>
        <span className="flex gap-4">
          <button className="button" disabled={disableConfirm} onClick={log_in}>
            Log In
          </button>
        </span>
      </div>
    </div>
  );
}
