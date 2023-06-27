/* eslint-disable import/export */
import { cleanup, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { afterEach } from "vitest";
import {
  RootState,
  store,
  preloadedState as initialState,
  rootReducer,
} from "../redux/store";
import { PreloadedState, configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router";

afterEach(() => {
  cleanup();
});

const setupStore = (preloadedState: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
};

function customRender(
  ui: React.ReactElement,
  preloadedState = initialState,
  store = setupStore(preloadedState),
  options = {}
) {
  return render(ui, {
    // wrap provider(s) here if needed
    wrapper: ({ children }) => (
      <MemoryRouter>
        <Provider store={store}>{children}</Provider>
      </MemoryRouter>
    ),
    ...options,
  });
}

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
// override render export
export { customRender as render };
