export function AddTaskInput({ setTaskInput }) {
  const onSubmitAddTask = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
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

export function TaskInput({ setInputTask, isEditing }) {
  const onSubmitTask = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const inputName = isEditing ? "editInputTask" : "addInputTask";
    setInputTask(data.get(inputName));
  };
  console.log(isEditing, setInputTask);
  return (
    <>
      <form onSubmit={onSubmitTask} className="todo-input">
        <input
          className="input-name-task"
          name={isEditing ? "editInputTask" : "addInputTask"}
          type="text"
          placeholder={isEditing ? "Edit Task" : "Add Task"}
          autoFocus
        />
      </form>
    </>
  );
}
