import { Navigate, Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import Lobby from "./lobby/lobby";
import Game from "./game/game";
import Navigation from "./navigation/navigation";
import Login from "./auth/login";
import CookieTest from "./auth/cookie-test";
import { Box, Button, Container } from "@mui/material";
import ProtectedRoute from "./auth/protectedRoute";
import MuiTest from "./test/mui-test";
import SocketTest from "./test/socket-test";

type RoutingProps = {};

const Routing = ({}: RoutingProps) => {
  return (
    <BrowserRouter>
      <Navigation />
      <Box
        sx={{
          maxWidth: "1280px",
          width: { xs: 400, xl: 1280 },
          height: "100%",
        }}
      >
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/lobby" element={<Lobby />} />
            {/* <Route path="/game/:id" element={<GameRoom />} /> */}
            <Route path="/game/:id" element={<Game />} />
            <Route path="/game" element={<Game />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/cookie-test" element={<CookieTest />} />
          <Route path="/mui-test" element={<MuiTest />} />
          <Route path="/socket" element={<SocketTest />} />
          <Route path="/" element={<Navigate replace to="/login" />} />
          {/* <Route path="/" element={<Navigate replace to="/socket" />} /> */}
        </Routes>
      </Box>
    </BrowserRouter>
  );
};

export default Routing;
