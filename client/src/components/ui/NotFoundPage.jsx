import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <>
      <h1>Not found page</h1>
      <Link to="/">
        <button>Go back Home</button>
      </Link>
    </>
  );
}
export default NotFoundPage;
