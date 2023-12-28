import path from "path";
import express from "express";
import logger from "morgan";
import bodyParser from "body-parser";

import "dotenv/config";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json({ limit: "50mb" }));

// serve public folder
app.use("/public", express.static(path.join(__dirname, "/../../public")));

app.use(logger("log"));

app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "/../../client/index.html"));
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
