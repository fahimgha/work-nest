export default function TaskInput({ setInputTask, inputValue, isEditing }) {
  const onSubmitTask = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);

    const inputName = isEditing ? "editInputTask" : "addInputTask";
    setInputTask(data.get(inputName));
  };

  const handleOnChange = (e) => {
    if (isEditing) {
      setInputTask(e.target.value);
    }
  };
  return (
    <>
      <form onSubmit={onSubmitTask} className="todo-input">
        <input
          className="input-name-task"
          name={isEditing ? "editInputTask" : "addInputTask"}
          value={inputValue}
          onChange={handleOnChange}
          type="text"
          placeholder={isEditing ? "Edit Task" : "Add Task"}
          autoFocus
        />
      </form>
    </>
  );
}
