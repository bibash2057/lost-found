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
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
