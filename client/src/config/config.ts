console.log("baseUrl: ", import.meta.env.VITE_BACKEND_BASE_URL);

export const config = {
  // backendBaseUrl: "https://battleships-app.fly.dev",
  backendBaseUrl: import.meta.env.VITE_BACKEND_BASE_URL,
};
