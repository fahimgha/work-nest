import "./App.css";
import Board from "./components/Board";
import Project from "./components/projects/Projects";
import Promodoro from "./components/promodoro/promodoro";
import { AuthContextProvider } from "./context/AuthContext";
import { TaskProvider } from "./context/TaskContext";

function App() {
  return (
    <>
      <TaskProvider>
        <AuthContextProvider>
          <Board />
          <div
            style={{
              display: "flex",
              gap: "1rem",
              margin: "0 0.5rem",
              width: "100%",
              flexWrap: "nowrap",
            }}
          >
            <section
              style={{
                width: "20%",
                minWidth: "250px",
                flexGrow: 1,
              }}
            >
              <Promodoro />
            </section>
            <section
              style={{
                width: "75%",
                minWidth: "300px",
                flexGrow: 1,
              }}
            >
              <Project />
            </section>
          </div>
        </AuthContextProvider>
      </TaskProvider>
    </>
  );
}

export default App;
