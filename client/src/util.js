export async function fetchTasks(user = "") {
  let tasks = [];
  try {
    // Always include the 'user' query parameter, even if it's empty
    const url = `http://localhost:5000/api/tasks?user=${user}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch tasks");
    tasks = await response.json();
  } catch (err) {
    console.error(err);
  }
  return tasks;
}


export async function deleteTask(taskID, setTasks) {
  try {
    const response = await fetch(`http://localhost:5000/tasks/${taskID}`, {
      method: "DELETE",
    });
    if (!response.ok) throw "Server Error";
    setTasks((prev) => prev.filter((task) => task.id !== taskID));
  } catch (err) {
    console.error(err);
    alert("Failed to delete task");
  }
}
