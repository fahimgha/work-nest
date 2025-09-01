import { memo } from "react";
const EmptyLines = ({ tasks, maxTaskCount }) => {
  const safeMaxTaskCount =
    typeof maxTaskCount === "number" && !isNaN(maxTaskCount) ? maxTaskCount : 0;

  const taskLength = Array.isArray(tasks) ? tasks.length : 0;

  const screenHeight = window.innerHeight;
  let baseLines = 6;

  if (screenHeight < 600) {
    baseLines = 4;
  } else if (screenHeight >= 900) {
    baseLines = 12;
  }
  const totalTarget = Math.max(safeMaxTaskCount, baseLines);
  const linesToShow = Math.max(0, totalTarget - taskLength);

  return Array(linesToShow)
    .fill(0)
    .map((_, index) => (
      <li className="li-tasks empty-line" key={`empty-line-${index}`}>
        <div className="notebook-line"></div>
      </li>
    ));
};
export default memo(EmptyLines);
