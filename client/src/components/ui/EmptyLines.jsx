export const EmptyLines = ({ tasks, maxTaskCount, minTotalItems }) => {
  // Ajoute des lignes supplémentaires si maxTaskCount dépasse 7
  const additionalLines =
    maxTaskCount > minTotalItems - 2
      ? Math.max(0, maxTaskCount - tasks.length - (minTotalItems - 2))
      : 0;

  // Calcul du nombre total de lignes à afficher
  const linesToShow = Math.max(
    1,
    minTotalItems - tasks.length - 1 + additionalLines
  );

  return Array(linesToShow)
    .fill(0)
    .map((_, index) => (
      <li className="li-tasks empty-line" key={`empty-line-${index}`}>
        <div className="notebook-line"></div>
      </li>
    ));
};
