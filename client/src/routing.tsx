import { Box } from "@mui/material";
import { Navigate, Route, Routes } from "react-router";
import { HashRouter } from "react-router-dom";
import { useGetInitialData } from "./api/useGetInitialData";
import Login from "./auth/login";
import ProtectedRoute from "./auth/protectedRoute";
import Game from "./game/game";
import Lobby from "./lobby/lobby";
import Navigation from "./navigation/navigation";

type RoutingProps = {};

const Routing = ({}: RoutingProps) => {
  useGetInitialData();

  return (
    <HashRouter>
      <Navigation />
      <Box>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/lobby" element={<Lobby />} />
            <Route path="/game/:id" element={<Game />} />
            <Route path="/game" element={<Game />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<Navigate replace to="/login" />} />
        </Routes>
      </Box>
    </HashRouter>
  );
};

export default Routing;
