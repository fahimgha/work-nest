import { useState } from "react";
import Logout from "../components/Logout";
import { Button } from "../components/ui/buttons/Button";
import AddProject from "../components/ui/AddProject";
function Home() {
  const [isAddingProject, setIsAddingProject] = useState(false);

  const startEditing = () => {
    setIsAddingProject((prevIsAddingProject) => !prevIsAddingProject);
  };

  return (
    <>
      <Logout />
      <Button onClick={startEditing}>Créer un projet</Button>
      {isAddingProject ? <AddProject /> : ""}
    </>
  );
}
export default Home;
