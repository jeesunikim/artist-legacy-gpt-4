import http from "http";
import path from "path";
import express from "express";
import favicon from "serve-favicon";
import logger from "morgan";
import methodOverride from "method-override";
import session from "express-session";
import bodyParser from "body-parser";
import multer from "multer";
import errorHandler from "errorhandler";

import "dotenv/config";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json({ limit: "50mb" }));

// serve public folder
app.use("/public", express.static(path.join(__dirname, "/../../public")));

app.use(logger("log"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/../../client/index.html"));
});

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'views', 'index.html'));
// });

// app.use("/chat", chatRouter);
// app.use("/images", imagesRouter);
// app.use("/files", fileRouter);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
