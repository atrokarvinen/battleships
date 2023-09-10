import { httpServer } from "./app";
import { connectToDb } from "./src/core/db";
import { env } from "./src/core/env";

connectToDb();

httpServer.listen(env.HTTP_PORT, env.HOST_ADDRESS, () => {
  console.log("Startup finished. Listening to port", env.HTTP_PORT);
}); 
