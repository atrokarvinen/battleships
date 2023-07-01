import { CircularProgress } from "@mui/material";
import { ReactElement, useState } from "react";
import { Outlet, useLocation } from "react-router";
import Unauthorized from "./unauthorized";
import { useAuth } from "./useAuth";

type ProtectedRouteProps = {
  children?: ReactElement;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuth, isLoading } = useAuth();
  const location = useLocation();

  const [unAuthRoute, setUnauthRoute] = useState<string | undefined>();
  if (isLoading) {
    return <CircularProgress />;
  }

  if (!isAuth) {
    const tryRoute = location.pathname;
    console.log(
      `not authenticated, saving route '${tryRoute}', redirecting...`
    );
    if (tryRoute !== unAuthRoute) {
      setUnauthRoute(tryRoute);
    }
    return <Unauthorized unAuthRoute={unAuthRoute} />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
