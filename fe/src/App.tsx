import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import AppLayout from "./layout/AppLayout";
import PageNotFound from "./page/PageNotFound";
import HomePage from "./page/HomePage";
import ReportItem from "./page/ReportItem";
import ItemPage from "./page/ItemPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <PageNotFound />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/item/:id", element: <ItemPage /> },
      { path: "/reportItem", element: <ReportItem /> },
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
