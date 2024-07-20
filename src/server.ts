import mongoose from "mongoose";
import app from "./app";
import { umbraBearerTokenBaseProcess } from "./services/authToken";
import appConfig from "./config/appConfig";

import dotenv from "dotenv";
dotenv.config({ path: ".env" });
const PORT = process.env.PORT;

process.on("uncaughtException", (error) => {
  console.log(error);
  process.exit(1);
});

const mongoURI = `mongodb://${process.env.MD_DB_USERNAME}:${process.env.MD_DB_PASSWORD}@${process.env.MD_DB_HOST}/${process.env.MD_DB_NAME}?authSource=${process.env.MD_DB_NAME}`;
mongoose
  .connect(mongoURI)
  .then((_conn) => {
    appConfig.dbConnectionSuccessful = true;
    console.log("Connected to MongoDB");
    // Refreshes token when expired. Hover on it to see description
    try {
      umbraBearerTokenBaseProcess();
    } catch (err) {
      appConfig.dbConnectionSuccessful = false;
    }
  })
  .catch((err) => {
    console.log("MongoDB connection failed for URI: ", mongoURI);
    console.log(err);
  });

app.listen(PORT, () => {
  console.log(`Umbra running on port ${PORT}`);
});
