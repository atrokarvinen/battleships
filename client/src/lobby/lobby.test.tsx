import { PreloadedState } from "@reduxjs/toolkit";
import { RootState, preloadedState } from "../redux/store";
import { render, screen } from "../test-utils/test-utils";
import Lobby from "./lobby";

it("renders", () => {
  render(<Lobby />);

  expect(screen.getByText(/create new game/i)).toBeVisible();
});

it("renders game", () => {
  const gameTitle = "test game";
  const state: PreloadedState<RootState> = {
    ...preloadedState,
    gameRoom: {
      byId: {
        ["1"]: {
          id: "1",
          players: [],
          title: gameTitle,
          createdAt: "",
          createdBy: "test user",
        },
      },
      allIds: ["id"],
    },
  };
  render(<Lobby />, state);

  expect(screen.getByText(gameTitle)).toBeVisible();
});
