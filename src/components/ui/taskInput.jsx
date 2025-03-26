import { useState, useEffect, useRef } from "react";
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
    setInputTask(data.get(inputName));
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
      </form>
    </>
  );
}
