import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "../redux/store";
import { render, screen, userEvent } from "../test-utils/test-utils";
import Login from "./login";
import { server } from "./login-mocks";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it("logs in", async () => {
  const store = configureStore({ reducer: rootReducer });
  render(<Login />, { store: store });
  
  await userEvent.type(screen.getByLabelText(/username/i), "test name");
  await userEvent.type(screen.getByLabelText(/password/i), "test password");
  
  await userEvent.click(screen.getByRole("button", { name: /login/i }));
  
  const state = store.getState();
  expect(state.auth.username).toBe("test name");
});

it("does not login when request is rejected", async () => {
  const store = configureStore({ reducer: rootReducer });
  render(<Login />, { store: store });

  await userEvent.type(screen.getByLabelText(/username/i), "shall not pass");
  await userEvent.type(screen.getByLabelText(/password/i), "test password");

  await userEvent.click(screen.getByRole("button", { name: /login/i }));

  const state = store.getState();
  expect(state.auth.username).toBeUndefined();
});
