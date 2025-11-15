import {
  createBrowserRouter,
  NavLink,
  Outlet,
  RouterProvider,
} from "react-router";
import HomePage from "./Components/HomePage";
import LogIn from "./Components/login";
import SignUp from "./Components/signup";
import { Menu as HamburgerMenu } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import TaskViewer from "./Components/TaskViewer";

const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "/login", Component: LogIn },
      { path: "/signup", Component: SignUp },
      { path: "/tasks", Component: TaskViewer },
      { path: "/analytics", Component: HomePage },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

function MainLayout() {
  const [showSidebar, setShowSidebar] = useState(false);
  const menuRef = useRef(null);

  const [user, setUser] = useState(null);

  return (
    <div className="w-screen h-screen">
      <main className="w-full h-full flex flex-col justify-between bg-slate-50">
        <header className="py-2 border-b bg-slate-200 border-[#709090] flex items-center justify-center shadow">
          <div className="max-w-4xl w-full flex justify-between items-center">
            <span className="w-1/3">
              <button
                ref={menuRef}
                className="altButton"
                onClick={() => setShowSidebar((prev) => !prev)}
              >
                <HamburgerMenu />
              </button>
            </span>
            <h1 className="text-center w-1/3">Task Tracker</h1>
            <span className="w-1/3 text-end">
              <button className="button">Log In</button>
            </span>
          </div>
        </header>
        <div className="h-full max-w-4xl w-full flex flex-col self-center">
          {showSidebar && (
            <SidebarComponent
              menuRef={menuRef}
              hide={() => setShowSidebar(false)}
            />
          )}
          <Outlet context={{ user: user }} />
        </div>
        <footer className="py-6 border-t border-[#709090] bg-slate-200 shadow"></footer>
      </main>
    </div>
  );
}

function SidebarComponent({ menuRef, hide }) {
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const ref = popupRef.current;
      if (
        ref &&
        menuRef.current &&
        !ref.contains(event.target) &&
        !menuRef.current.contains(event.target)
      ) {
        hide();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="absolute px-6 border rounded bg-slate-100 border-[#709090] shadow-xl"
      style={{
        left: menuRef.current.offsetLeft,
        top: menuRef.current.offsetTop + menuRef.current.offsetHeight + 10,
      }}
      ref={popupRef}
    >
      <nav className="py-4 flex flex-col gap-4" onClick={hide}>
        <NavLink to="/" className="button">
          Home
        </NavLink>
        <NavLink to="/login" className="button">
          Log In
        </NavLink>
        <NavLink to="/signup" className="button">
          Sign Up
        </NavLink>
        <NavLink to="/tasks" className="button">
          View Tasks
        </NavLink>
        <NavLink to="/analytics" className="button">
          Analytics
        </NavLink>
      </nav>
    </div>
  );
}

export default App;
