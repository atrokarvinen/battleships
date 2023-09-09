/* eslint-disable import/export */
import { PreloadedState, configureStore } from "@reduxjs/toolkit";
import { RenderOptions, cleanup, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import { afterEach } from "vitest";
import {
  RootState,
  preloadedState as initialState,
  rootReducer,
  store,
} from "../redux/store";

afterEach(() => {
  cleanup();
});

const setupStore = (preloadedState: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
};

export type CustomOptions = {
  preloadedState?: PreloadedState<RootState>;
  initialRoutes?: string[] | undefined;
  store?: typeof store;
  options?: RenderOptions;
};

function customRender(ui: React.ReactElement, customOptions: CustomOptions = {}) {
  const {
    preloadedState = initialState,
    initialRoutes = undefined,
    store = setupStore(preloadedState),
    options = {},
  } = customOptions;

  return render(ui, {
    // wrap provider(s) here if needed
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={initialRoutes}>
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
