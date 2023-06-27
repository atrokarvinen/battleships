import userEvent from "@testing-library/user-event";
import Lobby from "./lobby";
import { RootState, preloadedState, store } from "../redux/store";
import { render, screen } from "../test-utils/test-utils";
import { PreloadedState } from "@reduxjs/toolkit";

it("renders", () => {
  render(<Lobby />);

  expect(screen.getByText(/create new game/i)).toBeVisible();
});

it("renders game", () => {
  const gameTitle = "test game";
  const state: PreloadedState<RootState> = {
    ...preloadedState,
    gameRoom: {
      byId: { ["1"]: { id: "1", players: [], title: gameTitle } },
      allIds: ["id"],
    },
  };
  render(<Lobby />, state);

  expect(screen.getByText(gameTitle)).toBeVisible();
});
