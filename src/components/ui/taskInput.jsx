export default function TaskInput({ setInputTask, inputValue, isEditing }) {
  const onSubmitTask = (e) => {
    console.log("add");
    e.preventDefault();
    const data = new FormData(e.target);

    const inputName = isEditing ? "editInputTask" : "addInputTask";

    setInputTask(data.get(inputName));
  };

  return (
    <>
      <form onSubmit={onSubmitTask} className="todo-input">
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
