const express = require("express");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

app.use(express.json());
app.use("/api", chatRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

module.exports = app;