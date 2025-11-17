import { NavLink } from "react-router";
import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router";

export default function SignUp() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [disableConfirm, setDisableConfirm] = useState(true);
  const { setUser } = useOutletContext();
  const navigate = useNavigate();

  async function sign_up() {
    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // signup successful
        setUser(data.user.username); // updated to match backend
        navigate("/tasks");
      } else {
        // signup failed (e.g., user already exists)
        alert(data.error || "Sign up failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Server error during signup");
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
          Already have an account?{" "}
          <NavLink className="text-blue-600 underline" to="/login">
            Log In
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
          <button
            className="button"
            disabled={disableConfirm}
            onClick={sign_up}
          >
            Sign Up
          </button>
        </span>
      </div>
    </div>
  );
}
