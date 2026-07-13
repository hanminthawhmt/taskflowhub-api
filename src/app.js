const express = require("express");
const app = express();
const apiRoutes = require("./routes/routes");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/erroHandler");
app.use(express.json());
app.use(logger);
app.use("/api/v1", apiRoutes);
app.use(errorHandler);


module.exports = app;
