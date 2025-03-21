export function AddTaskInput({ setTaskInput }) {
  console.log("taskInput", "render");
  const onSubmitAddTask = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    setTaskInput(data.get("task"));
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
export function EditTaskInput({ onSubmitEditTask }) {
  return (
    <>
      <form onSubmit={onSubmitTask} className="todo-input">
        <input
          className="input-name-task"
          type="text"
          placeholder="Add a task"
          autoFocus
        />
      </form>
    </>
  );
}
