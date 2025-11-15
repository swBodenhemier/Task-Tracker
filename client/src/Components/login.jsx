import { NavLink, useOutletContext, useNavigate } from "react-router";
import { useState } from "react";

export default function LogIn() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [disableConfirm, setDisableConfirm] = useState(true);
  const { setUser } = useOutletContext();
  const navigate = useNavigate();

  async function log_in() {
    // TODO: API call goes here
    // if successful
    setUser(formData.username);
    navigate("/tasks");
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
              defaultValue={formData.username}
              onChange={(e) => {
                setFormData((prev) => {
                  prev.username = e.target.value;
                  return prev;
                });
                validateFormData();
              }}
            />
          </label>
          <label>
            <span>Password: </span>
            <input
              defaultValue={formData.password}
              type="password"
              onChange={(e) => {
                setFormData((prev) => {
                  prev.password = e.target.value;
                  return prev;
                });
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
