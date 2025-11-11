import { ChevronDown } from "lucide-react";

export default function TaskViewer() {
  const testTasks = [
    { name: "task1" },
    { name: "task2" },
    { name: "task3" },
    { name: "task4" },
    { name: "task5" },
    { name: "task6" },
    { name: "task7" },
  ];

  return (
    <div className="w-full h-full py-10">
      <div className="segment h-full w-full flex flex-col gap-4">
        <div className="flex justify-evenly w-full items-center">
          <span className="w-1/3"></span>
          <h2 className="w-1/3 text-center">[User's] Tasks</h2>
          <div className="flex justify-end gap-4 w-1/3">
            <button className="button min-w-20">Filter</button>
            <button className="button min-w-20">Sort</button>
          </div>
        </div>
        <div className="border border-[#709090] rounded bg-slate-50 w-full h-full px-4 flex flex-col gap-[1px]">
          {testTasks.map((task, index) => (
            <Task task={task} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Task({ task, index }) {
  return (
    <div
      className={`w-full border py-1 px-4 border-[#709090] flex justify-between ${
        index % 2 === 0 ? "bg-slate-200" : "bg-slate-50"
      }`}
    >
      <span>
        <ChevronDown />
      </span>
      <span>{task.name}</span>
      <span>This is a user's Task</span>
    </div>
  );
}
