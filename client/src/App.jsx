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
      >
        {/* <section
            style={{
              width: "20%",
              minWidth: "250px",
              flexGrow: 1,
            }}
          >
            <Promodoro />
          </section> */}
        {/* <section
            style={{
              width: "75%",
              minWidth: "300px",
              flexGrow: 1,
            }}
          >
            <Project />
          </section> */}
      </div>
    </>
  );
}

export default App;
