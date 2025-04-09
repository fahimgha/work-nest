import { Outlet } from "react-router-dom";
import Header from "./Header";

function SharedLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default SharedLayout;
