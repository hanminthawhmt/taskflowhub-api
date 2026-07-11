const express = require("express");
const app = express();
const apiRoutes = require("./routes/routes");
const logger = require("./middleware/logger");
app.use(express.json());
app.use(logger);
app.use("/api/v1", apiRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

module.exports = app;
