import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";

export const statusText = {
  0: "Assigned",
  1: "In Progress",
  2: "Complete",
  3: "Overdue",
  4: "Canceled",
};

const testTasks = [
  {
    name: "task1",
    id: 1,
    date_assigned: "2025-11-07",
    date_due: "2025-11-14",
    assigned_by: "user2",
    description:
      "This is a test task to demonstrate what a user's task might look like.",
    status: 1,
  },
  {
    name: "task2",
    id: 2,
    date_assigned: "2025-11-07",
    date_due: "2025-12-01",
    assigned_by: "user1",
    description:
      "This is a test task to demonstrate what a user's task might look like.",
    status: 1,
  },
  {
    name: "task3",
    id: 3,
    date_assigned: "2025-11-15",
    date_due: "2025-11-16",
    assigned_by: "user2",
    description:
      "This is a test task to demonstrate what a user's task might look like.",
    status: 1,
  },
  {
    name: "task4",
    id: 4,
    date_assigned: "2025-11-21",
    date_due: "2025-12-01",
    assigned_by: "user1",
    description:
      "This is a test task to demonstrate what a user's task might look like.",
    status: 1,
  },
  {
    name: "task5",
    id: 5,
    date_assigned: "2025-11-07",
    date_due: "2025-12-12",
    assigned_by: "user2",
    description:
      "This is a test task to demonstrate what a user's task might look like.",
    status: 1,
  },
  {
    name: "task6",
    id: 6,
    date_assigned: "2025-11-04",
    date_due: "2025-11-14",
    assigned_by: "user4",
    description:
      "This is a test task to demonstrate what a user's task might look like.",
    status: 1,
  },
  {
    name: "task7",
    id: 7,
    date_assigned: "2025-11-07",
    date_due: "2025-11-28",
    assigned_by: "user4",
    description:
      "This is a test task to demonstrate what a user's task might look like.",
    status: 1,
  },
];

export default function TaskViewer() {
  const [tasks, setTasks] = useState([]);
  const [showNewTask, setShowNewTask] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [sortTarget, setSortTarget] = useState("name");
  const [sortType, setSortType] = useState(0);
  const { user } = useOutletContext();

  // Fetch tasks from backend on first load
  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch(
          `http://localhost:5000/api/tasks?user=${user}`
        );
        if (!response.ok) throw new Error("Failed to fetch tasks");
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchTasks();
  }, [user]);

  async function updateSort(e) {
    const target = e.target.name;
    if (target === undefined || target === sortTarget) {
      setSortType((sortType + 1) % 2);
    } else {
      setSortTarget(target);
      setSortType(0);
    }
  }

  useEffect(() => {
    async function sortTasks() {
      const tempTasks = [...tasks];
      tempTasks.sort((a, b) => {
        if (sortTarget === "name" || sortTarget === "assigned_by") {
          return sortType === 0
            ? a[sortTarget].localeCompare(b[sortTarget])
            : b[sortTarget].localeCompare(a[sortTarget]);
        } else if (sortTarget.includes("date")) {
          const aDate = new Date(a[sortTarget]);
          const bDate = new Date(b[sortTarget]);
          return sortType === 0
            ? Number(aDate) - Number(bDate)
            : Number(bDate) - Number(aDate);
        } else {
          return sortType === 0
            ? a[sortTarget] - b[sortTarget]
            : b[sortTarget] - a[sortTarget];
        }
      });
      setTasks(tempTasks);
    }
    sortTasks();
  }, [sortTarget, sortType]);

  return (
    <div className="w-full h-full py-10">
      <div className="segment h-full w-full flex flex-col gap-4">
        <div className="flex justify-evenly w-full items-center">
          <div className="w-1/3">
            <button className="button" onClick={() => setShowNewTask(true)}>
              New Task
            </button>
          </div>
          <h2 className="w-1/3 text-center">{user}'s Tasks</h2>
          <div className="flex justify-end w-1/3">
            <button
              className="button min-w-20"
              onClick={() => setShowFilter(true)}
            >
              Filter
            </button>
          </div>
        </div>
        <div className="border border-[#709090] rounded bg-slate-50 w-full h-full max-h-[calc(100%-40px)] flex flex-col gap-[1px] py-1">
          <div className="w-full py-1 pl-4 flex items-center justify-between max-[700px]:hidden">
            <span className="w-1/4 flex gap-1 items-center">
              Name
              <button
                className="altButton small"
                name="name"
                onClick={updateSort}
              >
                {sortTarget === "name" ? (
                  sortType === 0 ? (
                    <ChevronDown />
                  ) : (
                    <ChevronUp />
                  )
                ) : (
                  "-"
                )}
              </button>
            </span>
            <span className="w-1/4 flex gap-1 items-center">
              Status
              <button
                className="altButton small"
                name="status"
                onClick={updateSort}
              >
                {sortTarget === "status" ? (
                  sortType === 0 ? (
                    <ChevronDown name="status" />
                  ) : (
                    <ChevronUp name="status" />
                  )
                ) : (
                  "-"
                )}
              </button>
            </span>
            <span className="w-1/6 flex gap-1 items-center">
              Date Assigned
              <button
                className="altButton small"
                name="date_assigned"
                onClick={updateSort}
              >
                {sortTarget === "date_assigned" ? (
                  sortType === 0 ? (
                    <ChevronDown />
                  ) : (
                    <ChevronUp />
                  )
                ) : (
                  "-"
                )}
              </button>
            </span>
            <span className="w-1/6 flex gap-1 items-center">
              Date Due
              <button
                className="altButton small"
                name="date_due"
                onClick={updateSort}
              >
                {sortTarget === "date_due" ? (
                  sortType === 0 ? (
                    <ChevronDown />
                  ) : (
                    <ChevronUp />
                  )
                ) : (
                  "-"
                )}
              </button>
            </span>
            <span className="w-1/6 flex gap-1 items-center">
              Assigned By
              <button
                className="altButton small"
                name="assigned_by"
                onClick={updateSort}
              >
                {sortTarget === "assigned_by" ? (
                  sortType === 0 ? (
                    <ChevronDown />
                  ) : (
                    <ChevronUp />
                  )
                ) : (
                  "-"
                )}
              </button>
            </span>
          </div>
          <div className="overflow-y-auto">
            {tasks
              .filter((task) => task.status !== 4)
              .map((task, index) => (
                <Task
                  task={task}
                  index={index}
                  key={task.id}
                  setTasks={setTasks}
                />
              ))}
          </div>
        </div>
      </div>
      {showNewTask && (
        <NewTaskForm
          hide={() => setShowNewTask(false)}
          user={user}
          addTask={(newTask) => {
            setTasks((prev) => [...prev, newTask]);
          }}
        />
      )}
      {showFilter && (
        <FilterForm hide={() => setShowFilter(false)} setTasks={setTasks} />
      )}
    </div>
  );
}

function Task({ task, index, setTasks }) {
  const [isExpanded, setIsExpanded] = useState(false);

  async function changeStatus(e, id) {
    const newStatus = Number(e.target.value);
    // TODO: API call goes here
    setTasks((prev) => {
      const updated = prev.map((t) =>
        t.id === id ? { ...t, status: newStatus } : t
      );
      return updated;
    });
  }

  return (
    <div className="flex flex-col hover:border-y border-[#709090] hover:z-4">
      <div
        className={`w-full py-1 pl-4 flex items-center justify-between text-nowrap max-[700px]:text-wrap max-[700px]:flex-wrap ${
          index % 2 === 0 ? "bg-slate-200" : "bg-slate-50"
        }`}
      >
        <span
          className="flex gap-4 items-center w-1/4 max-[700px]:w-fit"
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          <span className="altButton small">
            {isExpanded ? <ChevronUp /> : <ChevronDown />}
          </span>
          <span>{task.name}</span>
        </span>
        <span className="w-1/4 max-[700px]:w-fit">
          <select
            value={task.status}
            onChange={(e) => changeStatus(e, task.id)}
          >
            {Object.entries(statusText).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </span>
        <span className="w-1/6 max-[700px]:w-fit">{task.date_assigned}</span>
        <span className="w-1/6 max-[700px]:w-fit">{task.date_due}</span>
        <span className="w-1/6 max-[700px]:w-fit">{task.assigned_by}</span>
      </div>
      {isExpanded && (
        <div
          className={`px-16 pb-2 flex gap-6 justify-between items-center ${
            index % 2 === 0 ? "bg-slate-200" : "bg-slate-50"
          }`}
        >
          <span>{task.description}</span>
          <span className="flex justify-center gap-4">
            <button
              className="altButton"
              onClick={() => deleteTask(task.id, setTasks)}
            >
              Delete
            </button>
          </span>
        </div>
      )}
    </div>
  );
}

function NewTaskForm({ hide, user, addTask }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date_due: "",
  });
  const [disableConfirm, setDisableConfirm] = useState(true);

  async function handleNewTask() {
    const date = Date.now();
    const newTask = {
      ...formData,
      id: date,
      date_assigned: new Date(date).toISOString().split("T")[0],
      assigned_by: user,
      status: 0,
    };
    // TODO: API call goes here
    addTask(newTask);
    hide();
  }

  function validateFormData() {
    setDisableConfirm(
      formData.name === "" ||
        formData.description === "" ||
        formData.date_due === ""
    );
  }

  return (
    <div className="popup">
      <div className="segment flex flex-col gap-4 items-center">
        <h2>Create a new task</h2>
        <label>
          <span>Task Name: </span>
          <input
            defaultValue={formData.name}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, name: e.target.value }));
              validateFormData();
            }}
          />
        </label>
        <label>
          <span>Task Description: </span>
          <input
            defaultValue={formData.description}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, description: e.target.value }));
              validateFormData();
            }}
          />
        </label>
        <label>
          <span>Due Date: </span>
          <input
            type="date"
            defaultValue={formData.date_due}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, date_due: e.target.value }));
              validateFormData();
            }}
          />
        </label>
        <div className="flex gap-4">
          <button className="button red" onClick={hide}>
            Cancel
          </button>
          <button
            className="button"
            onClick={handleNewTask}
            disabled={disableConfirm}
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
}

function FilterForm({ hide, setTasks }) {
  const [formData, setFormData] = useState({
    status: -1,
    date_assigned: { type: "before", date: "" },
    date_due: { type: "before", date: "" },
    assigned_by: "",
  });

  async function applyFilters() {
    console.log(formData);
    const tasks = /* TODO: API call goes here*/ [];
    //setTasks(tasks);
    hide();
  }

  return (
    <div className="popup">
      <div className="segment flex flex-col gap-4 items-center">
        <h2>Filter Options</h2>
        <label>
          Status:{" "}
          <select
            defaultValue={formData.status}
            onChange={(e) =>
              setFormData((prev) => {
                prev.status = e.target.value;
                return prev;
              })
            }
          >
            <option className="italic" value={-1}>
              No Selection
            </option>
            {Object.values(statusText).map((status, index) => (
              <option key={status} value={index}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label>
          Assigned
          <span className="flex gap-1">
            <select
              defaultValue={formData.date_assigned.type}
              onChange={(e) =>
                setFormData((prev) => {
                  prev.date_assigned.type = e.target.value;
                  return prev;
                })
              }
            >
              <option value="before">before</option>
              <option value="after">after</option>
            </select>
            <input
              defaultValue={formData.date_assigned.date}
              onChange={(e) => {
                setFormData((prev) => {
                  prev.date_assigned.date = e.target.value;
                  return prev;
                });
              }}
              type="date"
            />
          </span>
        </label>
        <label>
          Due
          <span className="flex gap-1">
            <select
              defaultValue={formData.date_due.type}
              onChange={(e) =>
                setFormData((prev) => {
                  prev.date_due.type = e.target.value;
                  return prev;
                })
              }
            >
              <option value="before">before</option>
              <option value="after">after</option>
            </select>{" "}
            <input
              defaultValue={formData.date_due.date}
              onChange={(e) => {
                setFormData((prev) => {
                  prev.date_due.date = e.target.value;
                  return prev;
                });
              }}
              type="date"
            />
          </span>
        </label>
        <label>
          Assigned By:{" "}
          <input
            defaultValue={formData.assigned_by}
            onChange={(e) => {
              setFormData((prev) => {
                prev.assigned_by = e.target.value;
                return prev;
              });
            }}
          />
        </label>
        <div className="flex gap-4">
          <button className="button red" onClick={hide}>
            Cancel
          </button>
          <button className="button" onClick={applyFilters}>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

async function deleteTask(taskID, setTasks) {
  // TODO: API call goes here
  setTasks((prev) => prev.filter((task) => task.id !== taskID));
}
