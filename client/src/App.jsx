import "./App.css";
import Board from "./components/Board";
import { AuthContextProvider } from "./context/AuthContext";
import { TaskProvider } from "./context/TaskContext";

function App() {
  return (
    <>
      <TaskProvider>
        <AuthContextProvider>
          <Board />
        </AuthContextProvider>
      </TaskProvider>
    </>
  );
}

export default App;
