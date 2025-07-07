import Nav from "@/components/common/Nav";
import { useAuth } from "@/store/useAuth";
import { Navigate, Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="flex flex-col h-screen  ">
      <Nav />
      <div className="flex-1  py-5 px-5 md:px-12  max-w-screen-2xl mx-auto w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
