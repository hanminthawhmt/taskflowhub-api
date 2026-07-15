const express = require("express");
const app = express();
const apiRoutes = require("./routes/routes");
const billingRoutes = require("./modules/billing/route");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/erroHandler");
const { swaggerSetup } = require("./config/swagger");

app.use("/api/v1/billing", billingRoutes);
app.use(express.json());
app.use(logger);
swaggerSetup(app);
app.use("/api/v1", apiRoutes);
app.use(errorHandler);

module.exports = app;
