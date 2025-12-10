import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { fetchTasks } from "../util";  
import { NewTaskForm } from "./TaskViewer";

export const statusText = {
  0: "Assigned",
  1: "In Progress",
  2: "Complete",
  3: "Overdue",
  4: "Canceled",
};

// color function
function getTaskColor(task) {
  const today = new Date();
  const dueDate = new Date(task.date_due);

  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  if (task.status === 2) return "bg-green-500"; // Complete
  if (task.status === 4) return "bg-gray-400";  // Canceled
  if (dueDate < today) return "bg-red-500";      // Overdue

  const diffTime = dueDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "bg-orange-400";   // Due today
  if (diffDays <= 3) return "bg-yellow-400";    // Due soon
  return "bg-green-400";                       // Due later
}

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [showNewTask, setShowNewTask] = useState(false);
  const { user } = useOutletContext();
  const navigate = useNavigate();

  // send to login page if not logged in
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  // fetches all tasks
  useEffect(() => {
    async function setFromFetch() {
      const allTasks = await fetchTasks(); 
      setTasks(allTasks);  
    }
    setFromFetch();
  }, [user]);

  // calandar creation
  function generateCalendar() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();

    const calendar = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dayTasks = tasks.filter(
        (task) => new Date(task.date_due).getDate() === day
      );
      calendar.push({ day, dayTasks });
    }
    return calendar;
  }

  return (
    <div className="w-full min-h-screen py-10 px-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4 text-center">Dashboard - All Tasks</h2>

      
      <div className="calendar grid grid-cols-7 gap-2 w-full max-w-full">
        {generateCalendar().map((dayBox) => (
          <div
            key={dayBox.day}
            className="calendar-box p-2 border rounded min-h-[120px] flex flex-col"
          >
            <div className="font-bold mb-1">{dayBox.day}</div>
            <div className="flex flex-col gap-1 overflow-y-auto max-h-[80px]">
              {dayBox.dayTasks.map((task) => (
                <div
                  key={task.id}
                  className={`text-xs px-1 py-0.5 rounded ${getTaskColor(task)}`}
                  title={`Assigned to: ${task.assigned_to}\nStatus: ${statusText[task.status]}`}
                >
                  {task.name} ({task.assigned_to})
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showNewTask && (
        <NewTaskForm
          hide={() => setShowNewTask(false)}
          user={user}
          addTask={(newTask) => setTasks((prev) => [...prev, newTask])}
        />
      )}
    </div>
  );
}
