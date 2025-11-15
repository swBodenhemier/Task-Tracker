import { NavLink } from "react-router";

export default function LogIn() {
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
            <input />
          </label>
          <label>
            <span>Password: </span>
            <input type="password" />
          </label>
        </span>
        <span className="flex gap-4">
          <button className="button">Log In</button>
        </span>
      </div>
    </div>
  );
}
