const emptyLinesCount = 7;
export const EmptyLines = ({ tasks }) => {
  const linesToShow = Math.max(0, emptyLinesCount - tasks.length);

  return Array(linesToShow)
    .fill(0)
    .map((_, index) => (
      <li className="li-tasks empty-line" key={`empty-line-${index}`}>
        <div className="notebook-line"></div>
      </li>
    ));
};
