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

  const [deniedRoute, setDeniedRoute] = useState<string | undefined>();
  if (isLoading) {
    return <CircularProgress />;
  }

  if (!isAuth) {
    const route = location.pathname;
    console.log(`not authenticated, saving route '${route}', redirecting...`);
    if (route !== deniedRoute) {
      setDeniedRoute(route);
    }
    return <Unauthorized deniedRoute={deniedRoute} />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
