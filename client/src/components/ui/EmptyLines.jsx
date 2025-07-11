import React, { useState, useEffect } from "react";

export const EmptyLines = ({ tasks, maxTaskCount }) => {
  const [linesToShow, setLinesToShow] = useState(5); // Valeur par défaut

  const safeMaxTaskCount =
    typeof maxTaskCount === "number" && !isNaN(maxTaskCount) ? maxTaskCount : 0;
  const taskLength = Array.isArray(tasks) ? tasks.length : 0;

  console.log(safeMaxTaskCount);
  useEffect(() => {
    // Fonction pour calculer le nombre de lignes vides
    function updateLines() {
      // Hauteur de la fenêtre actuelle
      const screenHeight = window.innerHeight;

      // Calcul simple : plus l'écran est grand, plus on affiche de lignes
      let baseLines;

      if (screenHeight < 600) {
        // Petit écran
        baseLines = 4;
      } else if (screenHeight < 900) {
        // Écran moyen
        baseLines = 7;
      } else {
        // Grand écran
        baseLines = 10;
      }

      // On soustrait les tâches existantes pour avoir le nombre de lignes vides
      const emptyLines = Math.max(0, safeMaxTaskCount - taskLength);

      setLinesToShow(emptyLines);
    }
    updateLines();

    window.addEventListener("resize", updateLines);

    return () => window.removeEventListener("resize", updateLines);
  }, [taskLength]);

  return Array(linesToShow)
    .fill(0)
    .map((_, index) => (
      <li className="li-tasks empty-line" key={`empty-line-${index}`}>
        <div className="notebook-line"></div>
      </li>
    ));
};
