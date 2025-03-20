export default function Task({ taskValue }) {
  return (
    <>
      <li>
        <div className="input">
          <div
            className="tasks"
            style={{
              textDecoration: "none",
            }}
          >
            {taskValue}
          </div>
        </div>
      </li>
    </>
  );
}
