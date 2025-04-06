import "./App.css";
import Board from "./components/Board";
import Promodoro from "./components/promodoro/promodoro";
import { AuthContextProvider } from "./context/AuthContext";
import { TaskProvider } from "./context/TaskContext";

function App() {
  return (
    <>
      <TaskProvider>
        <AuthContextProvider>
          <Board />
          <Promodoro />
        </AuthContextProvider>
      </TaskProvider>
    </>
  );
}

export default App;
