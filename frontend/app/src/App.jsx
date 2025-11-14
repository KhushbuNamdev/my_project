import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { checkAuthStatus, logoutUser } from "./Slice/authSlice";
import LoginPage from "./Homepage/loginpage";
import DashboardLayout from "./component/Dashboard";
import theme from "./theme/theme";

document.body.style.backgroundAttachment = "fixed";
document.body.style.minHeight = "100vh";
document.body.style.margin = "0";
document.body.style.padding = "0";
document.body.style.fontFamily =
  'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;

  // Create router with future flag
  const router = createBrowserRouter(
    [
      {
        path: "/login",
        element: isAuthenticated ? (
          <Navigate to="/dashboard" replace />
        ) : (
          <LoginPage />
        ),
      },
      {
        path: "/dashboard/*",
        element: isAuthenticated ? (
          <DashboardLayout onLogout={handleLogout} />
        ) : (
          <Navigate to="/login" replace />
        ),
      },
      {
        path: "/",
        element: (
          <Navigate
            to={isAuthenticated ? "/dashboard" : "/login"}
            replace
          />
        ),
      },
    ],
    {
      future: {
        v7_startTransition: true, // 🔥 Fixes your warning
      },
    }
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
