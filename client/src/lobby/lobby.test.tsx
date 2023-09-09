import { PreloadedState } from "@reduxjs/toolkit";
import { RootState, preloadedState } from "../redux/store";
import { defaultGameRoom } from "../test-utils/defaults/defaultGameRoom";
import {
  render,
  screen,
  userEvent,
  waitForElementToBeRemoved,
} from "../test-utils/test-utils";
import Lobby from "./lobby";
import { USER_ID, server } from "./lobby-mocks";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it("renders game", () => {
  const gameTitle = "test game";
  const state: PreloadedState<RootState> = {
    ...preloadedState,
    gameRoom: {
      byId: {
        ["1"]: {
          ...defaultGameRoom,
          id: "1",
          title: gameTitle,
        },
      },
      allIds: ["id"],
    },
  };
  render(<Lobby />, { preloadedState: state });

  expect(screen.getByText(gameTitle)).toBeVisible();
});

it("loads games", async () => {
  render(<Lobby />);

  const gameTitle = defaultGameRoom.title;
  expect(await screen.findByText(gameTitle)).toBeVisible();
});

it("creates multiplayer gameroom", async () => {
  render(<Lobby />);

  await userEvent.click(
    screen.getByRole("button", { name: /create new game/i })
  );

  expect(await screen.findByTestId("create-game-dialog")).toBeVisible();

  await userEvent.type(screen.getByLabelText(/title/i), "test gameroom title");
  await userEvent.click(screen.getByRole("button", { name: /submit/i }));
  await waitForElementToBeRemoved(screen.queryByTestId("create-game-dialog"));

  expect(await screen.findByText("test gameroom title")).toBeVisible();
});

it("creates singleplayer gameroom", async () => {
  render(<Lobby />);

  await userEvent.click(
    screen.getByRole("button", { name: /create new game/i })
  );

  expect(await screen.findByTestId("create-game-dialog")).toBeVisible();

  await userEvent.type(screen.getByLabelText(/title/i), "test gameroom title");
  await userEvent.click(screen.getByText(/computer/i));
  await userEvent.click(screen.getByRole("button", { name: /submit/i }));
  await waitForElementToBeRemoved(screen.queryByTestId("create-game-dialog"));

  expect(await screen.findByText("test gameroom title")).toBeVisible();

  await userEvent.click(screen.getByText("test gameroom title"));
  expect(await screen.findByTestId("game-details-dialog")).toBeVisible();
  expect(screen.getByText(/single player/i)).toBeVisible();
});

it("deletes gameroom", async () => {
  const initialState: PreloadedState<RootState> = {
    ...preloadedState,
    auth: { ...preloadedState.auth, userId: USER_ID },
  };
  render(<Lobby />, { preloadedState: initialState });

  const gameTitle = defaultGameRoom.title;

  await userEvent.click(await screen.findByText(gameTitle));
  expect(await screen.findByTestId("game-details-dialog")).toBeVisible();

  const deleteButton = screen.getByRole("button", { name: /delete/i });
  expect(deleteButton).toBeEnabled();
  await userEvent.click(deleteButton);

  expect(screen.queryByText(gameTitle)).toBeNull();
});
