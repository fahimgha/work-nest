import "./App.css";
import Board from "./components/Board";
import { AuthContextProvider } from "./context/AuthContext";

function App() {
  return (
    <>
      <AuthContextProvider>
        <Board />
      </AuthContextProvider>
    </>
  );
}

export default App;
