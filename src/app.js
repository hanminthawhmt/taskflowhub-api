const express = require("express");
const app = express();
const apiRoutes = require("./routes/routes");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/error_handler");
app.use(express.json());
app.use(logger);
app.use(errorHandler);
app.use("/api/v1", apiRoutes);


module.exports = app;
