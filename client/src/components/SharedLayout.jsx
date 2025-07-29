import { Outlet } from "react-router-dom";
import Header from "./Header";

function SharedLayout() {
  return (
    <>
      <Outlet />
    </>
  );
}

export default SharedLayout;
