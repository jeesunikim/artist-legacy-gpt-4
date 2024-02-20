import path from "path";
import express from "express";
import logger from "morgan";
import bodyParser from "body-parser";

import OpenAI from "openai";

const openai = new OpenAI();

import "dotenv/config";

const app = express();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(bodyParser.text({ limit: "200mb" }));

// serve public folder
app.use("/public", express.static(path.join(__dirname, "/../../public")));

app.use(logger("log"));

app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "/../../client/index.html"));
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});

app.post("/api/gpt4", async (req, res) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Generate p5js code that mimics the image I uploaded. Setup its canvas width and height to be '700 by 700'.",
            },
            {
              type: "image_url",
              image_url: {
                url: req.body.image,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    });

    res.status(200).json({
      response: response.choices[0].message.content,
    });
  } catch (e) {
    console.error("/api/gpt4 call error: ", e);
  }
});
