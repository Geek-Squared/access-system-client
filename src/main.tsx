import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  useLocation,
  Outlet,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import AppBar from "./components/appbar/AppBar";
import BottomNavBar from "./components/nav/Navbar";
import ScanVisitorsOut from "./components/forms/visitorRegistration/ScanVisitorsOut";
import Capture from "./pages/capture";
import Home from "./pages/home";
import Register from "./pages/register";
import ProtectedRoute from "./components/ProtectedRoute copy";
import { AuthProvider } from "./context/authContext";
import Login from "./pages/login";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import Profile from "./pages/profile";
import FormDetail from "./components/forms/visitorRegistration/FormDetail";

const Layout = () => {
  const location = useLocation();

  // Hide AppBar and BottomNavBar on login and register pages
  const hideNavBarOnRoutes = ["/login", "/register"];
  const hideNavBar = hideNavBarOnRoutes.includes(location.pathname);

  return (
    <div>
      {!hideNavBar && <AppBar />} {/* Conditionally render AppBar */}
      <div className="main-content">
        <Outlet />
      </div>
      {!hideNavBar && <BottomNavBar />}{" "}
      {/* Conditionally render BottomNavBar */}
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <ProtectedRoute element={<Home />} />,
      },
      {
        path: "/capture-details",
        element: <ProtectedRoute element={<Capture />} />,
      },
      {
        path: "/scan-out",
        element: <ProtectedRoute element={<ScanVisitorsOut />} />,
      },
      {
        path: "/form/:formId",
        element: <ProtectedRoute element={<FormDetail />} />,
      },
      {
        path: "/settings",
        element: <ProtectedRoute element={<p>settings page</p>} />,
      },
      {
        path: "/profile",
        element: <ProtectedRoute element={<Profile />} />,
      },

      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
]);
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ConvexProvider>
  </React.StrictMode>
);
