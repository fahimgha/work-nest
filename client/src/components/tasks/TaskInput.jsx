export default function TaskInput({
  setInputTask,
  inputValue,
  isEditing,
  inputRef,
}) {
  const onSubmitTask = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const inputName = isEditing ? "editInputTask" : "addInputTask";
    const selectProjectName = parseInt(data.get("project"), 10);
    const project_id = isNaN(selectProjectName) ? null : selectProjectName;

    if (data.get(inputName)) {
      setInputTask({
        name: data.get(inputName),
        project_id,
      });
    }
  };

  return (
    <>
      <form
        onSubmit={onSubmitTask}
        ref={inputRef}
        className="todo-input add addInput"
      >
        <input
          className="input-name-task"
          name={isEditing ? "editInputTask" : "addInputTask"}
          defaultValue={inputValue}
          type="text"
          placeholder={isEditing ? "Edit Task" : "Add Task"}
          autoFocus
        />
      </form>
    </>
  );
}
