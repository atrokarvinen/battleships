import mongoose from "mongoose";
import { env } from "../core/env";

export const connectToDb = () => {
  const connectionString = env.DB_CONNECTION_STRING ?? "N/A";
  console.log(`Connecting to mongo db '${connectionString}'...`);
  return mongoose
    .connect(connectionString)
    .then(() => console.log("Successfully connected to mongo db"))
    .catch((err) => console.log("Failed to connect to mongo db: " + err));
};
