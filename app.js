const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();

const contactsRouter = require("./routes/api/contacts");
const authRouter = require("./routes/api/auth");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());

app.use(express.json());
app.use(express.static("public"));
// можна конкретизувати шлях:
// const path = require("node:path");
// const avatarsDir = path.join(__dirname, "public", "avatars");
// app.use("/api/users/avatars", express.static(avatarsDir));

// health check
// app.get("/", (req, res, next) => {
//   res.send("Hello world");
// });

app.use("/api/contacts", contactsRouter);
app.use("/api/users", authRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Page not found!" });
});

app.use((err, req, res, next) => {
  if (err.message === "Unexpected field") {
    return res.status(400).json({ message: "Invalid body (Unexpected field)" });
  }

  const { status = 500, message = "Server Error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
