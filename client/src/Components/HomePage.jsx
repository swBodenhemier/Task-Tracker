import { NavLink } from "react-router";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center py-40">
      <div className="segment flex flex-col items-center gap-6">
        <span className="text-lg text-center">
          Welcome to the Task Tracker, to begin, please log in or sign up.
        </span>
        <span className="flex gap-4">
          <NavLink to="/login" className="button">
            Log In
          </NavLink>
          <NavLink to="/signup" className="button">
            Sign Up
          </NavLink>
        </span>
      </div>
    </div>
  );
}
