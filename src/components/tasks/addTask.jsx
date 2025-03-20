export default function AddTask({ onSubmitTask, value }) {
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
