import express from "express";
import dotenv from "dotenv";
import router from "./routes/router";
import morganConfig from "./config/morganConfig";
import dbConnectionMiddleware from "./middlewares/dbConnectionMiddleware";

const app = express();
dotenv.config({ path: ".env" });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(dbConnectionMiddleware);
app.use(morganConfig);
app.use("/api/v1", router);

export default app;
