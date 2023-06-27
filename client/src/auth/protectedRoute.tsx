import { Outlet, useNavigate } from "react-router";
import { ReactElement } from "react";
import { Button, CircularProgress } from "@mui/material";
import { useAuth } from "./useAuth";

type ProtectedRouteProps = {
  children?: ReactElement;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuth, isLoading } = useAuth();
  const navigate = useNavigate();

  // Todo move to own file
  const Unauthorized = () => {
    return (
      <div>
        <h1>Not authorized, please log in</h1>
        <Button onClick={() => navigate("/")} variant="contained">
          Login
        </Button>
      </div>
    );
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!isAuth) {
    console.log("not authenticated, redirecting...");
    return <Unauthorized />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
