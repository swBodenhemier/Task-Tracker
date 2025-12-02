import { useOutletContext, useNavigate } from "react-router";
import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { fetchTasks } from "../util";
import { Task, NewTaskForm } from "./TaskViewer";

export default function TaskTracking() {
  const { user } = useOutletContext();
  const inputRef = useRef(null);
  const [tracking, setTracking] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showNewTask, setShowNewTask] = useState(false);
  const navigate = useNavigate();

  // catch unauthed
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);

  async function lookupUser() {
    const target = inputRef.current.value;
    const response = await fetch(`http://localhost:5000/user/${target}`);
    if (response.status !== 200) {
      alert("User not found, please ensure you correctly enter the username.");
      setTracking(null);
    } else {
      setTracking(target);
    }
  }

  useEffect(() => {
    async function getTrackedTasks() {
      const newTasks = await fetchTasks(tracking);
      setTasks(newTasks);
    }
    getTrackedTasks();
  }, [tracking]);

  return (
    <div className="w-full h-full py-10">
      <div className="segment h-full w-full flex flex-col items-center gap-4">
        <h2>Welcome {user}</h2>
        <div className="segment flex">
          <label>
            Find a User:{" "}
            <input
              className="rounded-r-none"
              placeholder="Enter Username"
              ref={inputRef}
            />
          </label>
          <button className="altButton !rounded-l-none" onClick={lookupUser}>
            <Search />
          </button>
        </div>
        {tracking && (
          <div className="flex w-full justify-evenly items-center">
            <span className="w-1/3">
              <button className="button" onClick={() => setShowNewTask(true)}>
                Assign {tracking} a new task
              </button>
            </span>
            <h2 className="w-1/3 text-center">{tracking}'s Tasks</h2>
            <span className="w-1/3"></span>
          </div>
        )}
        {tracking && (
          <div className="border border-[#709090] rounded bg-slate-50 w-full h-full max-h-[calc(100%-40px)] flex flex-col gap-[1px] py-1">
            <div className="w-full py-1 pl-4 flex items-center justify-between max-[700px]:hidden">
              <span className="w-1/4">Name</span>
              <span className="w-1/4">Status</span>
              <span className="w-1/6">Date Assigned</span>
              <span className="w-1/6">Date Due</span>
              <span className="w-1/6">Assigned By</span>
            </div>
            <div className="overflow-y-auto">
              {tasks.map((task, index) => (
                <Task
                  task={task}
                  index={index}
                  key={task.id}
                  setTasks={setTasks}
                  tracking={true}
                />
              ))}
            </div>
          </div>
        )}
        {tracking && showNewTask && (
          <NewTaskForm
            hide={() => setShowNewTask(false)}
            user={user}
            assigned_to={tracking}
            addTask={(newTask) => {
              setTasks((prev) => [...prev, newTask]);
            }}
          />
        )}
      </div>
    </div>
  );
}
