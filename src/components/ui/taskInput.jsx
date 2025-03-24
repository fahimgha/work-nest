export default function TaskInput({ setInputTask, isEditing }) {
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
