const app = require("./app");

const { port } = require("./config/env");

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${port}`);
});