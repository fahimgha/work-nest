import "./App.css";
import Board from "./pages/board/Board.jsx";
import Header from "./components/Header.jsx";

function App() {
  return (
    <>
      <Header />
      <Board />
      <div
        style={{
          display: "flex",
          gap: "1rem",
          margin: "0 0.5rem",
          width: "100%",
          flexWrap: "nowrap",
        }}
      ></div>
    </>
  );
}

export default App;
