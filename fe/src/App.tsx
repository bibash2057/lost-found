import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import AppLayout from "./layout/AppLayout";
import PageNotFound from "./page/PageNotFound";
import HomePage from "./page/HomePage";
import ReportItem from "./page/ReportItem";
import ItemPage from "./page/ItemPage";
import AuthLayout from "./layout/AuthLayout";
import LoginPage from "./page/LoginPage";
import RegisterPage from "./page/RegisterPage";
import MyReport from "./page/MyReport";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <PageNotFound />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/:id", element: <ItemPage /> },
      { path: "/reportItem", element: <ReportItem /> },
      { path: "/myReport", element: <MyReport /> },
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
