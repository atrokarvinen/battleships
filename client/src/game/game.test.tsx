import { PreloadedState } from "@reduxjs/toolkit";
import { Route, Routes } from "react-router-dom";
import { initialState as initialGameRoomState } from "../redux/gameRoomSlice";
import { RootState, preloadedState } from "../redux/store";
import { render, screen, userEvent, within } from "../test-utils/test-utils";
import Game from "./game";
import { server } from "./game-mocks";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it("renders without crash", () => {
  const initialState: PreloadedState<RootState> = {
    ...preloadedState,
  };
  render(<Game />, initialState);
});

it("has start button", () => {
  const initialState: PreloadedState<RootState> = {
    ...preloadedState,
    gameRoom: {
      ...initialGameRoomState,
      allIds: ["123"],
      byId: {
        "123": {
          id: "123",
          players: [],
          title: "test",
        },
      },
    },
    activeGame: {
      ...preloadedState.activeGame,
    },
  };
  render(
    <Routes>
      <Route path="/game/:id" element={<Game />} />
    </Routes>,
    initialState,
    ["/game/123"]
  );

  expect(screen.getByRole("button", { name: /start/i })).toBeInTheDocument();
});

it("clicks square", async () => {
  const initialState: PreloadedState<RootState> = {
    ...preloadedState,
    gameRoom: {
      ...initialGameRoomState,
      allIds: ["123"],
      byId: {
        "123": {
          id: "123",
          players: [],
          title: "test",
        },
      },
    },
    activeGame: {
      ...preloadedState.activeGame,
    },
    auth: {
      ...preloadedState.auth,
      userId: "1",
      username: "Player 1",
    },
  };
  render(
    <Routes>
      <Route path="/game/:id" element={<Game />} />
    </Routes>,
    initialState,
    ["/game/123"]
  );

  expect(screen.getByRole("button", { name: /start/i })).toBeInTheDocument();
  expect(await screen.findByText(/player 1/i)).toBeInTheDocument();
  expect(screen.getByText(/player 1/i).className).toContain("active");

  const ownBoard = screen.getByTestId("enemy-board");
  const square = within(ownBoard).getByTestId("square-0-0");
  expect(square).toBeInTheDocument();
  await userEvent.click(square);
});

it("cannot click same square twice", () => {
  expect(1).toBe(1);
});
