import { httpServer } from "./app";
import { env } from "./src/core/env";
import { connectToDb } from "./src/database/db";

connectToDb();

httpServer.listen(env.HTTP_PORT, env.HOST_ADDRESS, () => {
  console.log("Startup finished. Listening to port", env.HTTP_PORT);
});
