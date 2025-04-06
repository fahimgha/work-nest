import "./App.css";
import Board from "./components/Board";
import Memo from "./components/projects/Projects";
import Promodoro from "./components/promodoro/promodoro";
import { AuthContextProvider } from "./context/AuthContext";
import { TaskProvider } from "./context/TaskContext";

function App() {
  return (
    <>
      <TaskProvider>
        <AuthContextProvider>
          <Board />
          <div style={{ display: "flex", gap: "1rem", margin: "0 1rem" }}>
            <Promodoro />
            <Memo />
          </div>
        </AuthContextProvider>
      </TaskProvider>
    </>
  );
}

export default App;
