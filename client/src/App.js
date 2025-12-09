import {
  createBrowserRouter,
  NavLink,
  Outlet,
  RouterProvider,
  useNavigate,
} from "react-router";
import HomePage from "./Components/HomePage";
import LogIn from "./Components/login";
import SignUp from "./Components/signup";
import Dashboard from "./Components/Dashboard";
import { Menu as HamburgerMenu } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import TaskViewer from "./Components/TaskViewer";
import TaskTracking from "./Components/TaskTracking";

const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "/login", Component: LogIn },
      { path: "/signup", Component: SignUp },
      { path: "/tasks", Component: TaskViewer },
      { path: "/track", Component: TaskTracking },
      { path: "/analytics", Component: Dashboard },
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
  const navigate = useNavigate();

  function logOut() {
    setUser(null);
    navigate("/");
  }

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
              {user === null ? (
                <NavLink to="/login" className="button">
                  Log In
                </NavLink>
              ) : (
                <button className="button" onClick={logOut}>
                  Log out
                </button>
              )}
            </span>
          </div>
        </header>
        <div className="h-full max-w-4xl w-full flex flex-col self-center">
          {showSidebar && (
            <SidebarComponent
              menuRef={menuRef}
              hide={() => setShowSidebar(false)}
              user={user}
            />
          )}
          <Outlet context={{ user: user, setUser: setUser }} />
        </div>
        <footer className="py-6 border-t border-[#709090] bg-slate-200 shadow"></footer>
      </main>
    </div>
  );
}

function SidebarComponent({ menuRef, hide, user }) {
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
        {!user && (
          <NavLink to="/" className="button">
            Home
          </NavLink>
        )}
        {user && (
          <NavLink to="/tasks" className="button">
            View Tasks
          </NavLink>
        )}
        {user && (
          <NavLink to="/track" className="button">
            Track User's Tasks
          </NavLink>
        )}
        {user && (
          <NavLink to="/analytics" className="button">
            Analytics
          </NavLink>
        )}
      </nav>
    </div>
  );
}

export default App;
