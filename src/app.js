const express = require("express");
const app = express();
const apiRoutes = require("./routes/routes");
const billingRoutes = require("./modules/billing/route");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/erroHandler");
// Webhook route MUST be registered before express.json(), with its own raw-body middleware
app.use("/api/v1/billing", billingRoutes);
app.use(express.json());
app.use(logger);
app.use("/api/v1", apiRoutes);
app.use(errorHandler);

module.exports = app;
