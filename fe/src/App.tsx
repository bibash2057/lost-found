import "./App.css";
import HomePage from "./page/HomePage";
import MyReport from "./page/MyReport";
import ItemPage from "./page/ItemPage";
import LoginPage from "./page/LoginPage";
import AppLayout from "./layout/AppLayout";
import ReportItem from "./page/ReportItem";
import ClaimReport from "./page/ClaimReport";
import AuthLayout from "./layout/AuthLayout";
import RegisterPage from "./page/RegisterPage";
import PageNotFound from "./page/PageNotFound";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import React from "react";
import { toast } from "sonner";
import { useAuth } from "./store/useAuth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <PageNotFound />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/:id", element: <ItemPage /> },
      { path: "/myReport", element: <MyReport /> },
      { path: "/reportItem", element: <ReportItem /> },
      { path: "/claimReport/:id", element: <ClaimReport /> },
    ],
  },

  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
]);

function App() {
  const { logOut } = useAuth();
  const handleUnauthorized = React.useCallback(() => {
    toast.error("Session expired please login again");
    logOut();
  }, [logOut, toast]);

  const handleForbidden = React.useCallback(
    (e: any) => {
      const { error } = e.detail;
      toast.error("error", error?.message);
    },
    [toast]
  );

  React.useEffect(() => {
    window.addEventListener("forbidden", handleForbidden);
    return () => window.removeEventListener("forbidden", handleForbidden);
  }, [handleForbidden]);

  React.useEffect(() => {
    window.addEventListener("unauthorized", handleUnauthorized);
    return () => window.removeEventListener("unauthorized", handleUnauthorized);
  }, [handleUnauthorized]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
