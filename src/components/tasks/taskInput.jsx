export function AddTaskInput({ setTaskInput }) {
  console.log("taskInput", "render");

  const onSubmitAddTask = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    console.log("data", data);
    setTaskInput(data.get("task"), false);
    e.target.reset();
  };
  return (
    <>
      <form onSubmit={onSubmitAddTask} className="todo-input">
        <input
          className="input-name-task"
          name="task"
          type="text"
          placeholder="Add a task"
          autoFocus
        />
      </form>
    </>
  );
}
export function EditTaskInput({ setEditTaskInput }) {
  const onSubmitEditTask = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    setEditTaskInput(data.get("taskEdit"));
    e.target.reset();
  };
  return (
    <>
      <form onSubmit={onSubmitEditTask} className="todo-input">
        <input
          className="input-name-task"
          name="taskEdit"
          type="text"
          placeholder="Edit a task"
          autoFocus
        />
      </form>
    </>
  );
}
