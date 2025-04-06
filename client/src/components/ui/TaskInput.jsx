import { useTasks } from "../../context/TaskContext";

export default function TaskInput({
  setInputTask,
  inputValue,
  isEditing,
  inputRef,
}) {
  const { projects } = useTasks();
  const onSubmitTask = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const inputName = isEditing ? "editInputTask" : "addInputTask";

    if (data.get(inputName)) {
      setInputTask(data.get(inputName));
    }
  };

  return (
    <>
      <form onSubmit={onSubmitTask} ref={inputRef} className="todo-input">
        <input
          className="input-name-task"
          name={isEditing ? "editInputTask" : "addInputTask"}
          defaultValue={inputValue}
          type="text"
          placeholder={isEditing ? "Edit Task" : "Add Task"}
          autoFocus
        />
        <select name="project" className="todo-select">
          <option value="">Aucun projet</option>
          {projects?.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </form>
    </>
  );
}
