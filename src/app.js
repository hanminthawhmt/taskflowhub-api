const cors = require("cors");
const express = require("express");
const app = express();
const apiRoutes = require("./routes/routes");
const billingRoutes = require("./modules/billing/route");
const billingController = require("./modules/billing/controller");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/erroHandler");
const { swaggerSetup } = require("./config/swagger");

app.use(
  cors({
    origin: "http://localhost:5173", // your frontend's dev origin
    credentials: true, // if you ever send cookies; harmless to include even with JWT-in-header auth
  }),
);

app.post(
  "/api/v1/billing/webhook",
  express.raw({ type: "application/json" }),
  billingController.handleStripeWebhook,
);

app.use(express.json());
app.use(logger);
swaggerSetup(app);
app.use("/api/v1/billing", billingRoutes);
app.use("/api/v1", apiRoutes);
app.use(errorHandler);

module.exports = app;
