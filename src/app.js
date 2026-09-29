const exp = require("express");
const app = exp();

app.get("/health", (req, res) => {
    res.json({
    status: "ok"
  });
});

module.exports = app;