import { DeleteTaskButton } from "../ui/buttons";
import Checkbox from "../ui/checkbox";
export default function Task({ taskValue }) {
  return (
    <>
      <li>
        <div className="input">
          <Checkbox checked={false} onChange={() => null} />
          <div
            className="tasks"
            style={{
              textDecoration: "none",
            }}
          >
            {taskValue}
          </div>
          <DeleteTaskButton onClick={() => null} />
        </div>
      </li>
    </>
  );
}
